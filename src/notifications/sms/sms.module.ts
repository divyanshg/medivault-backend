import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SMSService } from './sms.service';

@Module({
  providers: [SMSService, ConfigService],
  exports: [SMSService],
})
export class SmsModule {}
