import * as crypto from 'crypto';
import { Request } from 'express';
import { FormDataRequest, MemoryStoredFile } from 'nestjs-form-data';

import {
    Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Roles } from '../decorators/roles/roles.decorator';
import { AuthGuard } from '../guards/jwt.guard';
import { CreateRecordDto, UploadInput } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { RecordsService } from './records.service';

@Controller('records')
export class RecordsController {
  constructor(
    private readonly recordsService: RecordsService,
    private readonly config: ConfigService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Roles('user')
  @UseGuards(AuthGuard)
  @Post()
  @FormDataRequest({ storage: MemoryStoredFile })
  async create(
    @Body() createRecordDto: CreateRecordDto,
    @Req() { user }: Request,
  ) {
    const { files, title, description, type } = createRecordDto; // Assuming you have an array of files

    try {
      const filesToUpload = files.length > 0 ? files : [files];

      const uploadResults =
        await this.cloudinaryService.uploadFiles(filesToUpload);

      // Handle uploadResults as an array of results
      const uploadInfoArray: UploadInput[] = uploadResults.map(
        (result, index) => ({
          url: result.url,
          mimeType: filesToUpload[index].busBoyMimeType,
          provider: 'cloudinary',
        }),
      );

      await this.recordsService.createRecord(
        uploadInfoArray,
        {
          title,
          description,
          type,
        },
        user.sub,
      );
      return uploadInfoArray;
    } catch (error) {
      console.log('error', error);
      throw new Error(error);
    }
  }

  @Roles('user')
  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() { user }: Request, @Query() { skip, take, cursor }: any) {
    return this.recordsService.records({
      skip,
      take,
      cursor,
      where: {
        user: {
          id: user.sub,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  @Roles('user')
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() { user }: Request) {
    return this.recordsService.findUnique({ id, userId: user.sub });
  }

  //TODO: add support to add or delete files
  @Roles('user')
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRecordDto: UpdateRecordDto,
    @Req() { user }: Request,
  ) {
    return this.recordsService.updateRecord({
      where: { id, userId: user.sub },
      data: updateRecordDto,
    });
  }

  @Roles('user')
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() { user }: Request) {
    return this.recordsService.deleteRecord({ id, userId: user.sub });
  }

  private async encryptFile(data: Buffer, key: string) {
    const cipher = crypto.createCipher('aes-256-cbc', key);
    const encryptedData = Buffer.concat([cipher.update(data), cipher.final()]);
    return encryptedData;
  }

  private async decryptFile(encryptedData: Buffer, key: string) {
    const decipher = crypto.createDecipher('aes-256-cbc', key);
    const decryptedData = Buffer.concat([
      decipher.update(encryptedData),
      decipher.final(),
    ]);
    return decryptedData;
  }
}
