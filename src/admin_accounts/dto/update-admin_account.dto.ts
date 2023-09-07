import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminAccountDto } from './create-admin_account.dto';

export class UpdateAdminAccountDto extends PartialType(CreateAdminAccountDto) {}
