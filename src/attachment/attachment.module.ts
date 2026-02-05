import { Module } from '@nestjs/common';
import { AttachmentsService } from './attachment.service';

@Module({
  providers: [AttachmentsService]
})
export class AttachmentModule {}
