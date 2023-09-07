import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminBankDto } from './create-admin_bank.dto';

export class UpdateAdminBankDto extends PartialType(CreateAdminBankDto) {}
