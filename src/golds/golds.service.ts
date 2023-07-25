import { Injectable } from '@nestjs/common';
import { CreateGoldDto } from './dto/create-gold.dto';
import { UpdateGoldDto } from './dto/update-gold.dto';

@Injectable()
export class GoldsService {
  create(createGoldDto: CreateGoldDto) {
    return 'This action adds a new gold';
  }

  findAll() {
    return `This action returns all golds`;
  }

  findOne(id: number) {
    return `This action returns a #${id} gold`;
  }

  update(id: number, updateGoldDto: UpdateGoldDto) {
    return `This action updates a #${id} gold`;
  }

  remove(id: number) {
    return `This action removes a #${id} gold`;
  }
}
