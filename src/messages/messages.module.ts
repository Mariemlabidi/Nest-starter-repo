import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesController } from './messages.controller';
import { HealthController } from './health.controller';
import { MessagesService } from './messages.service';
import { Message } from './message.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: Number(process.env.DATABASE_PORT || (process.env.NODE_ENV === 'test' ? 5433 : 5432)),
      username: process.env.DATABASE_USER || 'test',
      password: process.env.DATABASE_PASSWORD || 'test',
      database: process.env.DATABASE_DB || 'messages_db',
      entities: [Message],
      synchronize: process.env.NODE_ENV === 'test' ? true : false,
      logging: false,
    }),
    TypeOrmModule.forFeature([Message]),
  ],
  controllers: [MessagesController, HealthController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
