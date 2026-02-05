import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Message } from 'src/messages/message.entity'; 
@Entity('attachments')
export class Attachment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  mimetype: string;

  @Column()
  size: number;

  @Column()
  objectKey: string; // clé S3 / MinIO

  @ManyToOne(() => Message, { onDelete: 'CASCADE' })
  message: Message;

  @CreateDateColumn()
  createdAt: Date;
}
