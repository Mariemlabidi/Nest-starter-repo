import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesController } from './messages.controller';
import { HealthController } from './health.controller';
import { MessagesService } from './messages.service';
import { Message } from './message.entity';
import { Attachment } from '../attachment/attachment.entity';
import { User } from '../users/users.entity';
import { NotificationsQueue } from '../notifications/notifications.queue';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Attachment, User]),
    ConfigModule,
  ],
  controllers: [MessagesController, HealthController],
  providers: [MessagesService, NotificationsQueue],
  exports: [MessagesService],
})
export class MessagesModule {}
