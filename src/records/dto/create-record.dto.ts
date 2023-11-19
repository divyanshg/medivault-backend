import { IsString } from 'class-validator';
import { HasMimeType, IsFile, MaxFileSize } from 'nestjs-form-data';

import { RecordType } from '@prisma/client';

// class File {
//   @IsFile()
//   // @MaxFileSize(21.e6) // 2MB
//   @HasMimeType([
//     'image/png',
//     'image/jpeg',
//     'application/pdf',
//     'text/csv',
//     'application/x-cfb', // docs
//     'application/msword',
//     'application/vnd.oasis.opendocument.spreadsheet',
//     'application/vnd.oasis.opendocument.text',
//     'application/vnd.ms-excel', // Excel files
//     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//   ])
//   file: any;
// }

export class CreateRecordDto {
  @IsFile({
    each: true,
  })
  @HasMimeType(
    [
      'image/png',
      'image/jpeg',
      'application/pdf',
      'text/csv',
      'application/x-cfb', // docs
      'application/msword',
      'application/vnd.oasis.opendocument.spreadsheet',
      'application/vnd.oasis.opendocument.text',
      'application/vnd.ms-excel', // Excel files
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
    {
      each: true,
    },
  )
  files?: any[];

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  type: RecordType;
}

export class UploadInput {
  url: string;

  mimeType: string;

  provider: string;
}
