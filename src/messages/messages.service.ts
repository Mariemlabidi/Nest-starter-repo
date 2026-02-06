import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { CreateMessageDto } from './dtos/create-message.dto';
import { UpdateMessageDto } from './dtos/update-message.dto';
import { NotificationsQueue } from 'src/queue/notifications.queue';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly repo: Repository<Message>,
     private notificationsQueue: NotificationsQueue,
  ) {}

  async create(dto: CreateMessageDto) {
  const msg = await this.repo.save(this.repo.create(dto));

  await this.notificationsQueue.addNotification({
    messageId: msg.id,
    content: msg.content,
  });

  return msg;
}


  findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number) {
    const found = await this.repo.findOneBy({ id });
    if (!found) throw new NotFoundException(`Message ${id} not found`);
    return found;
  }

  async update(id: number, dto: UpdateMessageDto) {
    const msg = await this.findOne(id);
    Object.assign(msg, dto);
    return this.repo.save(msg);
  }

  async remove(id: number) {
    const msg = await this.findOne(id);
    await this.repo.remove(msg);
    return { deleted: true };
  }
}
