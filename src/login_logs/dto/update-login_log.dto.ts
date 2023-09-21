import { PartialType } from '@nestjs/mapped-types';
import { CreateLoginLogDto } from './create-login_log.dto';

export class UpdateLoginLogDto extends PartialType(CreateLoginLogDto) {}
