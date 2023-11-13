import { PartialType } from '@nestjs/mapped-types';
import { CreateAllowedIpDto } from './create-allowed_ip.dto';

export class UpdateAllowedIpDto extends PartialType(CreateAllowedIpDto) {}
