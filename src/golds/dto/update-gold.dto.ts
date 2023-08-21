import { PartialType } from '@nestjs/mapped-types';
import { CreateGoldDto } from './create-gold.dto';

export class UpdateGoldDto extends PartialType(CreateGoldDto) {}
