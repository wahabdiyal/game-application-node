import { PartialType } from '@nestjs/mapped-types';
import { CreateSilverDto } from './create-silver.dto';

export class UpdateSilverDto extends PartialType(CreateSilverDto) {}
