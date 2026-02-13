import { Module } from '@nestjs/common';
import { NotificationsQueue } from './notifications.queue';
import { NotificationsWorker } from './notifications.worker';
import { NotificationsController } from './notifications.controller';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [
    ConfigModule, //OBLIGATOIRE
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsQueue,
    NotificationsWorker,
  ],
  exports: [
    NotificationsQueue,
  ],
})
export class NotificationsModule {}
