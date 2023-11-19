import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';

import { EmailService, MailInput } from '../email.service';

@Injectable()
export class SendgridService implements EmailService {
  constructor(private readonly config: ConfigService) {
    SendGrid.setApiKey(this.config.get<string>('SEND_GRID_KEY'));
  }

  async send({ to, content, subject }: MailInput): Promise<void> {
    const msg: SendGrid.MailDataRequired = {
      to,
      from: this.config.get<string>('EMAIL_FROM'),
      subject,
      text: content,
    };
    await SendGrid.send(msg);

    return;
  }
}
