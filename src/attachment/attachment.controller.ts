import {
  Controller,
  Post,
  Param,
  ParseIntPipe,
  Body,
  Get,
  Delete,
} from '@nestjs/common';
import { AttachmentsService } from './attachment.service';

@Controller('attachments')
export class AttachmentsController {
  constructor(private readonly service: AttachmentsService) {}

  
  @Post(':messageId')
  createMetadata(
    @Param('messageId', ParseIntPipe) messageId: number,
    @Body()
    body: {
      filename: string;
      mimetype: string;
      size: number;
      objectKey: string;
    },
  ) {
    return this.service.create(messageId, body);
  }
  @Get('message/:messageId')
  listByMessage(@Param('messageId', ParseIntPipe) messageId: number) {
    return this.service.findByMessage(messageId);
  }

  
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
