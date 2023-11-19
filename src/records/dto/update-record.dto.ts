import { PickType } from '@nestjs/mapped-types';

import { CreateRecordDto } from './create-record.dto';

export class UpdateRecordDto extends PickType(CreateRecordDto, [
  'description',
  'title',
  'type',
]) {}
