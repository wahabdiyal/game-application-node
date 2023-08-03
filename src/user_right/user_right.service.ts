import { Injectable } from '@nestjs/common';
import { CreateUserRightDto } from './dto/create-user_right.dto';
import { UpdateUserRightDto } from './dto/update-user_right.dto';

@Injectable()
export class UserRightService {
  create(createUserRightDto: CreateUserRightDto) {
    return 'This action adds a new userRight';
  }

  findAll() {
    return `This action returns all userRight`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userRight`;
  }

  update(id: number, updateUserRightDto: UpdateUserRightDto) {
    return `This action updates a #${id} userRight`;
  }

  remove(id: number) {
    return `This action removes a #${id} userRight`;
  }
}
