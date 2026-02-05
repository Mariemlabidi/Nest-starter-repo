import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attachment } from './attachment.entity';
import { Message } from '../messages/message.entity';
import axios from 'axios';

@Injectable()
export class AttachmentsService {
  private readonly MAX_SIZE = 5 * 1024 * 1024; // 5MB
  private readonly ALLOWED_TYPES = ['image/png', 'image/jpeg', 'application/pdf'];

  constructor(
    @InjectRepository(Attachment)
    private readonly repo: Repository<Attachment>,
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
  ) {}

  async create(
    messageId: number,
    data: {
      filename: string;
      mimetype: string;
      size: number;
      objectKey: string;
    },
  ) {
    const message = await this.messageRepo.findOneBy({ id: messageId });
    if (!message) throw new NotFoundException(`Message ${messageId} not found`);

    // ✅ contraintes upload
    if (data.size > this.MAX_SIZE) {
      throw new BadRequestException('File too large');
    }

    if (!this.ALLOWED_TYPES.includes(data.mimetype)) {
      throw new BadRequestException('Invalid file type');
    }

    const attachment = this.repo.create({
      filename: data.filename,
      mimetype: data.mimetype,
      size: data.size,
      objectKey: data.objectKey,
      message,
    });

    return this.repo.save(attachment);
  }

  findByMessage(messageId: number) {
    return this.repo.find({
      where: { message: { id: messageId } },
      order: { createdAt: 'DESC' },
    });
  }

  async remove(id: number) {
    const attachment = await this.repo.findOneBy({ id });
    if (!attachment) throw new NotFoundException('Attachment not found');

    // supprimer dans MinIO via HTTP
    await axios.delete(
      `${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET}/${attachment.objectKey}`,
      {
        auth: {
          username: process.env.MINIO_ACCESS_KEY!,
          password: process.env.MINIO_SECRET_KEY!,
        },
      },
    );

    await this.repo.remove(attachment);
    return { deleted: true };
  }
}
