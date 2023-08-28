import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Games } from './schemas/games.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Injectable()
export class GamesService {
  
  constructor(
    @InjectModel(Games.name)
        private gameModel: mongoose.Model<Games>,
    
    ) {}

  async create(createGameDto: CreateGameDto) {
    var res = await this.gameModel.create(createGameDto);
    return res;
  }

 

  async findAll() {
    return await this.gameModel.find();
  }

  async findOne(id: string) {
    return await this.gameModel.findOne({_id : id});
  }

 async update(id: string, updateGameDto: UpdateGameDto) {
  const game = await this.gameModel.findByIdAndUpdate(id,updateGameDto);
  if (!game) {
    throw new NotFoundException('game not found.');
  }
  return {status: true,message: "game updated successfully"};
  }

  async remove(id: string) {
    const game = await this.gameModel.findByIdAndDelete(id);

    if (!game) {
      throw new NotFoundException('game not found.');
    }

    return {status: true,message: "game Delete successfully"};
  }
}
