import { PartialType } from '@nestjs/mapped-types';
import { CreateUserRightDto } from './create-user_right.dto';

export class UpdateUserRightDto extends PartialType(CreateUserRightDto) {}
