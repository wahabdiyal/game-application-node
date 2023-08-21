import { PartialType } from '@nestjs/mapped-types';
import { CreateCoinUserDto } from './create-coin_user.dto';

export class UpdateCoinUserDto extends PartialType(CreateCoinUserDto) {}
