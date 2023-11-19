import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { CloudinaryProvider } from '../cloudinary/cloudinary.provider';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PrismaModule } from '../prisma/prisma.module';
import { RecordsController } from './records.controller';
import { RecordsService } from './records.service';

@Module({
  imports: [
    ConfigModule,
    CloudinaryModule,
    NestjsFormDataModule.config({ storage: MemoryStoredFile }),
    PrismaModule,
  ],
  controllers: [RecordsController],
  providers: [
    RecordsService,
    JwtService,
    ConfigService,
    CloudinaryService,
    CloudinaryProvider,
  ],
})
export class RecordsModule {}
