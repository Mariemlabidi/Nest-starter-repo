import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { User } from '../users/users.entity';
import { CreateMessageDto } from './dtos/create-message.dto';
import { UpdateMessageDto } from './dtos/update-message.dto';
import { NotificationsQueue } from 'src/notifications/notifications.queue';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private notificationsQueue: NotificationsQueue,
  ) {}

  async create(dto: CreateMessageDto, senderId: number) {
    // Vérifier que le destinataire existe
    const recipient = await this.userRepo.findOne({
      where: { id: dto.recipientId },
    });
    if (!recipient) {
      throw new NotFoundException(
        `Utilisateur avec l'ID ${dto.recipientId} non trouvé`,
      );
    }

    // Vérifier que l'expéditeur existe
    const sender = await this.userRepo.findOne({
      where: { id: senderId },
    });
    if (!sender) {
      throw new NotFoundException(`Utilisateur ${senderId} non trouvé`);
    }

    // Créer le message
    const message = this.messageRepo.create({
      content: dto.content,
      senderId,
      recipientId: dto.recipientId,
      sender,
      recipient,
    });

    const savedMessage = await this.messageRepo.save(message);

    // Queue notification email
    await this.notificationsQueue.addNotification({
      type: 'new-message',
      messageId: savedMessage.id,
      senderId: senderId,
      senderEmail: sender.email,
      recipientEmail: recipient.email,
      recipientId: dto.recipientId,
      content: dto.content,
      timestamp: new Date().toISOString(),
    });

    return savedMessage;
  }

  // Obtenir tous les messages pour l'utilisateur actuel
  findAll(userId: number) {
    return this.messageRepo.find({
      where: [
        { senderId: userId },
        { recipientId: userId },
      ],
      relations: ['sender', 'recipient'],
      order: { createdAt: 'DESC' },
    });
  }

  // Obtenir les messages avec un utilisateur spécifique
  async getConversation(userId: number, otherUserId: number) {
    const messages = await this.messageRepo.find({
      where: [
        { senderId: userId, recipientId: otherUserId },
        { senderId: otherUserId, recipientId: userId },
      ],
      relations: ['sender', 'recipient'],
      order: { createdAt: 'ASC' },
    });
    return messages;
  }

  // Obtenir les contacts (utilisateurs avec qui on a échangé des messages)
  async getContacts(userId: number) {
    const messages = await this.messageRepo
      .createQueryBuilder('message')
      .where('message.senderId = :userId OR message.recipientId = :userId', {
        userId,
      })
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.recipient', 'recipient')
      .orderBy('message.createdAt', 'DESC')
      .getMany();

    // Extraire les contacts uniques
    const contactsMap = new Map();
    for (const msg of messages) {
      const contactId =
        msg.senderId === userId ? msg.recipientId : msg.senderId;
      const contact = msg.senderId === userId ? msg.recipient : msg.sender;

      if (!contactsMap.has(contactId)) {
        contactsMap.set(contactId, {
          id: contact.id,
          email: contact.email,
          lastMessage: msg.content,
          lastMessageTime: msg.createdAt,
        });
      }
    }

    return Array.from(contactsMap.values());
  }

  async findOne(id: number) {
    const found = await this.messageRepo.findOne({
      where: { id },
      relations: ['sender', 'recipient'],
    });
    if (!found) throw new NotFoundException(`Message ${id} non trouvé`);
    return found;
  }

  async update(id: number, dto: UpdateMessageDto) {
    const msg = await this.findOne(id);
    Object.assign(msg, dto);
    return this.messageRepo.save(msg);
  }

  async remove(id: number, userId: number) {
    const msg = await this.findOne(id);
    // only sender or recipient may delete
    if (msg.senderId !== userId && msg.recipientId !== userId) {
      throw new UnauthorizedException('Not allowed to delete this message');
    }
    await this.messageRepo.remove(msg);
    return { deleted: true, id };
  }
  }

