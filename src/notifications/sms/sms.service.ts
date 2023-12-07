import axios from 'axios';

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SMSInput } from '../../types';

@Injectable()
export class SMSService {
  constructor(private readonly config: ConfigService) {}

  async send(options: SMSInput) {
    try {
      // if (this.config.get<string>('NODE_ENV') === 'production') {
      const response = await axios.post(
        this.config.get<string>('FAST2SMS_API'),
        {
          route: 'v3',
          language: 'english',
          ...options,
        },
        {
          headers: {
            authorization: this.config.get<string>('FAST2SMS_API_KEY'),
          },
        },
      );
      console.log('SMS SENT');
      return response.data;
      // } else {
      // Logger.log(options);
      // }
    } catch (error: any) {
      return {
        error: error.message,
        code: 'SMS_SENDING_FAILED',
      };
    }
  }
}
