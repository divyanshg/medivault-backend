import { UploadApiErrorResponse, v2 } from 'cloudinary';

import { Injectable, Logger } from '@nestjs/common';

import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  public async uploadFiles(
    files: any[],
  ): Promise<unknown[] | UploadApiErrorResponse> {
    this.logger.log('Uploading files to cloudinary');

    return Promise.all(
      files.map(async (file) => {
        return new Promise((resolve, reject) => {
          const upload = v2.uploader.upload_stream((error, result) => {
            if (error) return reject(error);
            resolve(result);
          });
          toStream(file.buffer).pipe(upload);
        });
      }),
    );
  }
}
