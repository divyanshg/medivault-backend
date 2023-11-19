import { Injectable, Logger } from '@nestjs/common';
import { AddedBy, Prisma, Records } from '@prisma/client';

import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecordDto, UploadInput } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';

@Injectable()
export class RecordsService {
  constructor(
    private cloudinary: CloudinaryService,
    private prisma: PrismaService,
  ) {}

  async createRecord(
    filesInfo: UploadInput[],
    record: CreateRecordDto,
    userId: string,
    added_by?: AddedBy,
  ) {
    const data: Prisma.RecordsCreateInput = {
      title: record.title,
      description: record.description,
      type: record.type,
      files: {
        create: filesInfo,
      },
      user: {
        connect: {
          id: userId,
        },
      },
      added_by: added_by ?? 'self',
      fileCount: filesInfo.length,
    };

    try {
      await this.prisma.records.create({
        data,
      });

      return true;
    } catch (error) {
      Logger.error(error);
      throw new Error(error);
    }
  }

  async findUnique(
    recordsWhereUniqueInput: Prisma.RecordsWhereUniqueInput,
    select?: Prisma.RecordsSelect,
  ): Promise<Partial<Records> | null> {
    return this.prisma.records.findUnique({
      where: recordsWhereUniqueInput,
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        files: true,
        added_by: true,
        createdAt: true,
        updatedAt: true,
        ...select,
      },
    });
  }

  async records(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.RecordsWhereUniqueInput;
    where?: Prisma.RecordsWhereInput;
    orderBy?: Prisma.RecordsOrderByWithRelationInput;
    select?: Prisma.RecordsSelect;
  }): Promise<Records[]> {
    const { skip, take, cursor, where, orderBy, select } = params;
    return this.prisma.records.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async updateRecord(params: {
    where: Prisma.RecordsWhereUniqueInput;
    data: Prisma.RecordsUpdateInput;
  }): Promise<Records> {
    const { where, data } = params;
    return this.prisma.records.update({
      data,
      where,
    });
  }

  async deleteRecord(where: Prisma.RecordsWhereUniqueInput): Promise<Records> {
    return this.prisma.records.delete({
      where,
    });
  }
}
