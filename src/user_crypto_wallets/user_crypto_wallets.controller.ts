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

@Controller('user-crypto-wallets')
export class UserCryptoWalletsController {
  constructor(
    private readonly userCryptoWalletsService: UserCryptoWalletsService,
  ) {}

  @Post()
  create(@Body() createUserCryptoWalletDto: CreateUserCryptoWalletDto) {
    return this.userCryptoWalletsService.create(createUserCryptoWalletDto);
  }

  @Get()
  findAll() {
    return this.userCryptoWalletsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userCryptoWalletsService.findOne(id);
  }

  @Get('/user/:user_id')
  findOneUser(@Param('user_id') user_id: string) {
    return this.userCryptoWalletsService.findOneUser(user_id);
  }

  @Get('/selectedWallet/:user_id')
  findOneUserSelected(@Param('user_id') user_id: string) {
    return this.userCryptoWalletsService.findOneUserSelected(user_id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserCryptoWalletDto: UpdateUserCryptoWalletDto,
  ) {
    return this.userCryptoWalletsService.update(id, updateUserCryptoWalletDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userCryptoWalletsService.remove(id);
  }
}
