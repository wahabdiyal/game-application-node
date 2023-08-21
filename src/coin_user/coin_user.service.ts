import { Injectable } from '@nestjs/common';
import { CreateCoinUserDto } from './dto/create-coin_user.dto';
import { UpdateCoinUserDto } from './dto/update-coin_user.dto';
import { GoldsService } from 'src/golds/golds.service';
import { UserService } from 'src/user/user.service';
import { SilversService } from 'src/silvers/silvers.service';

@Injectable()
export class CoinUserService {
  constructor(
      private goldService: GoldsService,
      private userService: UserService,
      private silverService: SilversService
    ){}
  create(createCoinUserDto: CreateCoinUserDto) {
    return 'This action adds a new coinUser';
  }

  findAll() {
    return `This action returns all coinUser`;
  }

  findOne(id: number) {
    return `This action returns a #${id} coinUser`;
  }

  update(id: number, updateCoinUserDto: UpdateCoinUserDto) {
    return `This action updates a #${id} coinUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} coinUser`;
  }
}
