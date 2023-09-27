import { PartialType } from '@nestjs/mapped-types';
import { CreateUserMenuDto } from './create-user_menu.dto';

export class UpdateUserMenuDto extends PartialType(CreateUserMenuDto) {}
