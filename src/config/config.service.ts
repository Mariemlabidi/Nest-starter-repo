import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly config: NestConfigService) {}

  // ENV
  get nodeEnv(): string {
    return this.config.get<string>('NODE_ENV');
  }

  // DATABASE
  get dbHost(): string {
    return this.config.get<string>('DATABASE_HOST');
  }

  get dbPort(): number {
    return Number(this.config.get<number>('DATABASE_PORT'));
  }

  get dbUser(): string {
    return this.config.get<string>('DATABASE_USER');
  }

  get dbPassword(): string {
    return this.config.get<string>('DATABASE_PASSWORD');
  }

  get dbName(): string {
    return this.config.get<string>('DATABASE_DB');
  }

  // JWT
  get jwtSecret(): string {
    return this.config.get<string>('JWT_SECRET');
  }

  // REDIS
  get redisHost(): string {
    return this.config.get<string>('REDIS_HOST', 'localhost');
  }

  get redisPort(): number {
    return Number(this.config.get<number>('REDIS_PORT', 6379));
  }
}

