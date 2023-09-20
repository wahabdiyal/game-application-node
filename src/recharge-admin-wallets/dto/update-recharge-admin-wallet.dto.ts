import { PartialType } from '@nestjs/mapped-types';
import { CreateRechargeAdminWalletDto } from './create-recharge-admin-wallet.dto';

export class UpdateRechargeAdminWalletDto extends PartialType(CreateRechargeAdminWalletDto) {}
