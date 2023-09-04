import { PartialType } from '@nestjs/mapped-types';
import { CreateCryptoWalletDto } from './create-crypto_wallet.dto';

export class UpdateCryptoWalletDto extends PartialType(CreateCryptoWalletDto) {}
