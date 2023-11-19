import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { EmailModule } from './email/email.module';
import { NotificationsService } from './notifications.service';
import { SmsModule } from './sms/sms.module';
import { SMSService } from './sms/sms.service';

@Module({
  imports: [ConfigModule, SmsModule, EmailModule],
  providers: [NotificationsService, ConfigService, SMSService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
