import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Worker, Job } from 'bullmq';
import { AppConfigService } from '../config/config.service';

@Injectable()
export class NotificationsWorker implements OnModuleInit {
  private readonly logger = new Logger(NotificationsWorker.name);
  private worker: Worker;

  constructor(private readonly config: AppConfigService) {}

  onModuleInit() {
    this.worker = new Worker(
      'notifications',
      async (job: Job) => {
        this.logger.log(
          `📬 Processing notification job ${job.id}: ${job.data.type}`,
        );

        try {
          const { type, ...data } = job.data;

          switch (type) {
            case 'new-message':
              await this.handleNewMessageNotification(data);
              break;
            case 'email':
              await this.handleEmailNotification(data);
              break;
            case 'sms':
              await this.handleSmsNotification(data);
              break;
            default:
              this.logger.warn(`Unknown notification type: ${type}`);
          }

          this.logger.log(
            `✅ Notification job ${job.id} completed successfully`,
          );
        } catch (error) {
          this.logger.error(
            `❌ Error processing job ${job.id}: ${error.message}`,
            error.stack,
          );
          throw error;
        }
      },
      {
        connection: {
          host: this.config.redisHost,
          port: this.config.redisPort,
        },
      },
    );

    this.worker.on('failed', (job, err) => {
      this.logger.error(
        `🚨 Job ${job?.id} failed after retries: ${err.message}`,
        err.stack,
      );
    });

    this.worker.on('completed', (job) => {
      this.logger.log(`✨ Job ${job.id} completed successfully`);
    });
  }

  /**
   * EXPLICATION: Traite les notifications de nouveaux messages
   * Cet handler est appelé quand un utilisateur envoie un message à un autre
   * Il extrait les données du message et simule l'envoi d'un email au destinataire
   */
  private async handleNewMessageNotification(data: any) {
    const {
      messageId,
      senderId,
      senderEmail,
      recipientEmail,
      content,
      timestamp,
    } = data;

    this.logger.log(
      `📧 Nouveau message de ${senderEmail} à ${recipientEmail}`,
    );
    this.logger.log(`   Message: "${content}"`);
    this.logger.log(`   ID: ${messageId}, Heure: ${timestamp}`);

    // Envoyer l'email de notification
    await this.simulateEmailSending({
      to: recipientEmail,
      subject: `📬 Nouveau message de ${senderEmail}`,
      body: `
        <h2>Vous avez reçu un nouveau message</h2>
        <p><strong>De:</strong> ${senderEmail}</p>
        <p><strong>Message:</strong></p>
        <blockquote>${content}</blockquote>
        <p><small>Reçu le: ${new Date(timestamp).toLocaleString('fr-FR')}</small></p>
      `,
    });
  }

  /**
   * EXPLICATION: Traite les notifications email génériques
   * Utilisé pour les notifications qui ne sont pas liées à un message spécifique
   */
  private async handleEmailNotification(data: any) {
    const { email, subject, message } = data;

    this.logger.log(`📧 Envoi d'email à ${email}`);
    this.logger.log(`   Sujet: ${subject}`);

    await this.simulateEmailSending({
      to: email,
      subject,
      body: message,
    });
  }

  /**
   * EXPLICATION: Traite les notifications SMS
   * Pour les notifications par SMS (à configurer avec Twilio par exemple)
   */
  private async handleSmsNotification(data: any) {
    const { phone, message } = data;

    this.logger.log(`📱 Envoi SMS à ${phone}`);
    this.logger.log(`   Message: ${message}`);
    // TODO: Intégrer avec Twilio ou autre service SMS
  }

  /**
   * EXPLICATION: Simule l'envoi d'un email
   * Dans un environnement réel, ceci appellerait un service email comme SendGrid ou Gmail
   * Pour maintenant, on affiche juste dans les logs
   */
  private async simulateEmailSending(emailData: {
    to: string;
    subject: string;
    body: string;
  }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.logger.log(`
╔═══════════════════════════════════════════════════════════╗
║           📨 EMAIL ENVOYÉ AVEC SUCCÈS                     ║
╠═══════════════════════════════════════════════════════════╣
║ To:      ${emailData.to}
║ Subject: ${emailData.subject}
╚═══════════════════════════════════════════════════════════╝
        `);
        resolve(true);
      }, 1000);
    });
  }
}
