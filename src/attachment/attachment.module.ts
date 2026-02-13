import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttachmentsService } from './attachment.service';
import { AttachmentsController } from './attachment.controller';
import { Attachment } from './attachment.entity';
import { Message } from '../messages/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attachment, Message])],
  providers: [AttachmentsService],
  controllers: [AttachmentsController],
})
export class AttachmentModule {}
