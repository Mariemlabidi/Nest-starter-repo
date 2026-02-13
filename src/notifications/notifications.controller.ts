import { Controller, Post, Body } from '@nestjs/common';
import { NotificationsQueue } from './notifications.queue';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsQueue: NotificationsQueue) {}

  @Post('email')
  async sendEmailNotification(
    @Body()
    body: {
      email: string;
      subject: string;
      message: string;
    },
  ) {
    try {
      const { email, subject, message } = body;

      // Add job to queue for processing
      await this.notificationsQueue.addNotification({
        type: 'email',
        recipient: email,
        subject,
        message,
        timestamp: new Date().toISOString(),
      });

      // In a real scenario, you would use a mail service like nodemailer or SendGrid
      // For now, we'll log the notification
      console.log(
        `📧 Email queued for ${email}: ${subject}`,
      );

      return {
        status: 'success',
        message: 'Notification queued for sending',
        email,
      };
    } catch (error) {
      console.error('Error sending notification:', error);
      return {
        status: 'error',
        message: 'Failed to queue notification',
      };
    }
  }

  @Post('sms')
  async sendSmsNotification(
    @Body() body: { phone: string; message: string },
  ) {
    try {
      const { phone, message } = body;

      await this.notificationsQueue.addNotification({
        type: 'sms',
        recipient: phone,
        message,
        timestamp: new Date().toISOString(),
      });

      console.log(`📱 SMS queued for ${phone}: ${message}`);

      return {
        status: 'success',
        message: 'SMS queued for sending',
        phone,
      };
    } catch (error) {
      console.error('Error sending SMS:', error);
      return {
        status: 'error',
        message: 'Failed to queue SMS',
      };
    }
  }
}
