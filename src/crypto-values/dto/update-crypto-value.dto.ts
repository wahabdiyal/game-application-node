import { PartialType } from '@nestjs/mapped-types';
import { CreateCryptoValueDto } from './create-crypto-value.dto';

export class UpdateCryptoValueDto extends PartialType(CreateCryptoValueDto) {}
