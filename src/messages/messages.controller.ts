import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  HttpCode,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CreateMessageDto } from './dtos/create-message.dto';
import { UpdateMessageDto } from './dtos/update-message.dto';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly service: MessagesService) {}

  // Obtenir tous les messages de l'utilisateur actuel
  @Get()
  listMessages(@Request() req) {
    const userId = parseInt(req.user.id, 10);
    return this.service.findAll(userId);
  }

  // Créer un nouveau message
  @Post()
  createMessage(@Body() body: CreateMessageDto, @Request() req) {
    const userId = parseInt(req.user.id, 10);
    return this.service.create(body, userId);
  }

  // Obtenir les contacts (utilisateurs avec qui on a échangé)
  @Get('contacts')
  getContacts(@Request() req) {
    const userId = parseInt(req.user.id, 10);
    return this.service.getContacts(userId);
  }

  // Obtenir la conversation avec un utilisateur spécifique
  @Get('conversation/:userId')
  getConversation(
    @Param('userId', ParseIntPipe) userId: number,
    @Request() req,
  ) {
    const me = parseInt(req.user.id, 10);
    return this.service.getConversation(me, userId);
  }

  // Obtenir un message spécifique
  @Get('/:id')
  getMessage(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  // Mettre à jour un message
  @Patch('/:id')
  updateMessage(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateMessageDto,
  ) {
    return this.service.update(id, body);
  }

  // Supprimer un message (seulement l'expéditeur ou le destinataire)
  @Delete('/:id')
  @HttpCode(200)
  deleteMessage(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    const userId = parseInt(req.user.id, 10);
    return this.service.remove(id, userId);
  }
}
