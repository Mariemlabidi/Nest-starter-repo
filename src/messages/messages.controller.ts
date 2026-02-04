import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe, HttpCode } from '@nestjs/common';
import { CreateMessageDto } from './dtos/create-message.dto';
import { UpdateMessageDto } from './dtos/update-message.dto';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly service: MessagesService) {}

  @Get()
  listMessages() {
    return this.service.findAll();
  }

  @Post()
  createMessage(@Body() body: CreateMessageDto) {
    return this.service.create(body);
  }

  @Get('/:id')
  getMessage(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch('/:id')
  updateMessage(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateMessageDto) {
    return this.service.update(id, body);
  }

  @Delete('/:id')
  @HttpCode(200)
  deleteMessage(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
