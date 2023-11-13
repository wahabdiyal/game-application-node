import { PartialType } from '@nestjs/mapped-types';
import { CreateCoinTraDto } from './create-coin_tra.dto';

export class UpdateCoinTraDto extends PartialType(CreateCoinTraDto) {}
