import { PartialType } from '@nestjs/mapped-types';
import { CreateSignupRewardDto } from './create-signup_reward.dto';

export class UpdateSignupRewardDto extends PartialType(CreateSignupRewardDto) {}
