import { PartialType } from '@nestjs/mapped-types';
import { CreateReferralRewardDto } from './create-referral_reward.dto';

export class UpdateReferralRewardDto extends PartialType(
  CreateReferralRewardDto,
) {}
