import { PartialType } from '@nestjs/mapped-types';
import { CreateCreateLogDto } from './create-create-log.dto';

export class UpdateCreateLogDto extends PartialType(CreateCreateLogDto) {}
