import { Cache } from 'cache-manager';
import { v4 as uuidv4 } from 'uuid';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SMSInput } from '../types';
import { EmailService, MailInput } from './email/email.service';
import { SMSService } from './sms/sms.service';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly config: ConfigService,
    private readonly sms: SMSService,
    private readonly email: EmailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async sendSMS(options: SMSInput) {
    try {
      const response = await this.sms.send({
        ...options,
      });
      return response;
    } catch (error: any) {
      return {
        error: error.message,
        code: 'SMS_SENDING_FAILED',
      };
    }
  }

  async sendEmail(options: MailInput) {
    try {
      const response = await this.email.send({
        ...options,
      });
      return response;
    } catch (error: any) {
      return {
        error: error.message,
        code: 'EMAIL_SENDING_FAILED',
      };
    }
  }

  private generateOtp(): number {
    const length = this.config.get<number>('OTP_LENGTH') ?? 4;
    if (length <= 0) {
      throw new Error('Length must be greater than 0');
    }

    // Generate the first digit (1-9, excluding 0)
    const firstDigit = Math.floor(Math.random() * 9) + 1;

    // Generate the remaining digits
    const otpDigits: string[] = [String(firstDigit)];
    for (let i = 1; i < length; i++) {
      otpDigits.push(String(Math.floor(Math.random() * 10)));
    }

    return Number(otpDigits.join(''));
  }

  async generateAndSendOtp(phoneNumber: string) {
    const otp = this.generateOtp();
    const verificationUUID = `MEDIVAULT-${uuidv4()}-${phoneNumber}`;

    //save to cache
    await this.cacheManager.set(verificationUUID, otp, 300);
    const message = `Your OTP for Medivault is ${otp}`;
    const response = await this.sms.send({
      numbers: phoneNumber,
      message,
    });

    return {
      ...response,
      otp,
      verificationUUID,
    };
  }
}
