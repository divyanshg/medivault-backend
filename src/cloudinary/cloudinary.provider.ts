import { v2 } from 'cloudinary';

import { ConfigModule, ConfigService } from '@nestjs/config';

import { CLOUDINARY } from '../constants';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  imports: [ConfigModule],
  useFactory: async (config: ConfigService) => {
    return v2.config({
      cloud_name: config.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: config.get<string>('CLOUDINARY_API_KEY'),
      api_secret: config.get<string>('CLOUDINARY_API_SECRET'),
    });
  },
  inject: [ConfigService],
};
