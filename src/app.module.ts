import { redisStore } from 'cache-manager-redis-store';

import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { EmailModule } from './notifications/email/email.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SmsModule } from './notifications/sms/sms.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { RecordsModule } from './records/records.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        store: (await redisStore({
          url: config.get<string>('REDIS_HOSTNAME'),
          // password: config.get<string>('REDIS_PASSWORD'),
        })) as unknown as CacheStore,
        ttl: 5,
      }),
      inject: [ConfigService],
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    NotificationsModule,
    SmsModule,
    EmailModule,
    PrismaModule,
    RecordsModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, CloudinaryService],
})
export class AppModule {}
