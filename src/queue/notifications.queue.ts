import { Queue } from 'bullmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsQueue {
  private queue: Queue;

  constructor() {
    this.queue = new Queue('notifications', {
      connection: {
        host: 'localhost',
        port: 6379,
      },
    });
  }

  async addNotification(data: any) {
    await this.queue.add(
      'send-notification',
      data,
      {
        attempts: 3,        //retries
        backoff: 5000,      //5s entre chaque tentative
      },
    );
  }
}
