// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import { AppConfigService } from './config/config.service';
import { MessagesModule } from './messages/messages.module';
import { NotificationsQueue } from './notifications/notifications.queue';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule, //OBLIGATOIRE

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], //TRÈS IMPORTANT
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        type: 'postgres',
        host: config.dbHost,
        port: config.dbPort,
        username: config.dbUser,
        password: config.dbPassword,
        database: config.dbName,
        autoLoadEntities: true,
        synchronize: config.nodeEnv === 'test',
      }),
    }),
     MessagesModule, //OBLIGATOIRE
     AuthModule, //OBLIGATOIRE
         
  ],
  
})
export class AppModule {}
