import { PartialType } from '@nestjs/mapped-types';
import { CreateUserCryptoWalletDto } from './create-user_crypto_wallet.dto';

export class UpdateUserCryptoWalletDto extends PartialType(
  CreateUserCryptoWalletDto,
) {}
