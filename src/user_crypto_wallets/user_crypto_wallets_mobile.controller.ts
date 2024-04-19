import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserCryptoWalletsService } from './user_crypto_wallets.service';
import { CreateUserCryptoWalletDto } from './dto/create-user_crypto_wallet.dto';
import { UpdateUserCryptoWalletDto } from './dto/update-user_crypto_wallet.dto';

@Controller('user-crypto-wallets-mobile')
export class UserCryptoWalletsMobileController {
  constructor(
    private readonly userCryptoWalletsService: UserCryptoWalletsService,
  ) {}

  @Post()
  async create(@Body() createUserCryptoWalletDto: CreateUserCryptoWalletDto) {
    const cryptoDetail = await this.userCryptoWalletsService.create(
      createUserCryptoWalletDto,
    );
    return { status: true, wallet: cryptoDetail };
  }

  @Get()
  findAll() {
    return { status: false, message: 'not allow' };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const crypto = await this.userCryptoWalletsService.findOne(id);
    return { status: true, wallet: crypto };
  }

  @Get('/user/:user_id')
  async findOneUser(@Param('user_id') user_id: string) {
    const withuser = await this.userCryptoWalletsService.findOneUser(user_id);
    if (withuser) {
      return { status: true, wallets: withuser };
    }
    return { status: false, message: 'User not found.' };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserCryptoWalletDto: UpdateUserCryptoWalletDto,
  ) {
    return await this.userCryptoWalletsService.update(
      id,
      updateUserCryptoWalletDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userCryptoWalletsService.remove(id);
  }
}
