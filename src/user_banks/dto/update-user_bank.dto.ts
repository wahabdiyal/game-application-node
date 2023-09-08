import { PartialType } from '@nestjs/mapped-types';
import { CreateUserBankDto } from './create-user_bank.dto';

export class UpdateUserBankDto extends PartialType(CreateUserBankDto) {}
