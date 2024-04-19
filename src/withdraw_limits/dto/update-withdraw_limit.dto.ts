import { PartialType } from '@nestjs/mapped-types';
import { CreateWithdrawLimitDto } from './create-withdraw_limit.dto';

export class UpdateWithdrawLimitDto extends PartialType(
  CreateWithdrawLimitDto,
) {}
