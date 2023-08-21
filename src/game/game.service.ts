import { Game } from './schemas/game.schema';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Injectable()
export class GameService {

  constructor(
    @InjectModel(Game.name)
      private gameModel: mongoose.Model<Game>,
  ){}

  async create(createGameDto: CreateGameDto):Promise<Game> {
    const game = await this.gameModel.create(createGameDto);
    return game;
  }

  async findAll():Promise<Game[]> {
    return await this.gameModel.find();
  }

  async findOne(id: string):Promise<Game> {
    return await this.gameModel.findById(id);
  }

  async update(id: any, body:UpdateGameDto) {
    const game = await this.gameModel.findByIdAndUpdate(id,body);
  
    if (!game) {
      throw new NotFoundException('Game not found.');
    }
  
    return {status: true,message: "Game updated successfully"};
  }

  async remove(id: any) {
    const game = await this.gameModel.findByIdAndDelete(id);

    if (!game) {
      throw new NotFoundException('Game not found.');
    }

    return {status: true,message: "Game Delete successfully"};
  }
}
