import { Injectable, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';
import { AppConfigService } from '../config/config.service';

@Injectable()
export class NotificationsQueue implements OnModuleInit {
  private queue: Queue;

  constructor(private readonly config: AppConfigService) {}

  onModuleInit() {
    this.queue = new Queue('notifications', {
      connection: {
        host: this.config.redisHost,
        port: this.config.redisPort,
      },
    });
  }

  async addNotification(data: any) {
    await this.queue.add('notify', data);
  }
}
