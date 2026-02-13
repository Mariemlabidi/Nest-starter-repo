import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';   
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AppConfigService } from 'src/config/config.service';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [
    ConfigModule, //OBLIGATOIRE
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
        imports: [ConfigModule], //TRÈS IMPORTANT
        inject: [AppConfigService],
        useFactory: (config: AppConfigService) => ({
          secret: config.jwtSecret,
          signOptions: { expiresIn: '1d' },
        }),
    })

  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}

