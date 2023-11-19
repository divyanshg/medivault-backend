import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { EmailService } from './email.service';
import { SendgridService } from './services/sendgrid.service';

@Module({
  //add more services here
  imports: [ConfigModule],
  providers: [
    {
      provide: EmailService,
      useClass: SendgridService,
    },
  ],
  exports: [EmailService],
})
export class EmailModule {}
