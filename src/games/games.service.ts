import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Games } from './schemas/games.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import * as admin from 'firebase-admin';
import firebase from 'firebase/app'
@Injectable()
export class GamesService {
  private firestore: FirebaseFirestore.Firestore;
  constructor(
    @InjectModel(Games.name)
    private gameModel: mongoose.Model<Games>,

  ) {
    this.firestore = admin.firestore();
  }

  async create(createGameDto: CreateGameDto) {
    try {

      await this.firestore.collection('notifications').add({
        _id: '12sssdddEHSHJJJ',
        coins: 20
      })
      return await this.gameModel.create(createGameDto);
    } catch (error) {
      if (error.code === 11000 || error.code === 11001) {
        return 'Duplicate entry'; // Return a custom error message
      }
      throw error;
    }
  }



  async findAll() {
    return await this.gameModel.find();
  }
  async getActiveGamesCount() {
    return await this.gameModel.countDocuments({ status: 'active' });
  }


  async findOne(id: string) {
    return await this.gameModel.findOne({ _id: id });
  }

  async update(id: string, updateGameDto: UpdateGameDto) {
    const game = await this.gameModel.findByIdAndUpdate(id, updateGameDto);
    if (!game) {
      throw new NotFoundException('game not found.');
    }
    return { status: true, message: "game updated successfully" };
  }

  async remove(id: string) {
    const game = await this.gameModel.findByIdAndDelete(id);

    if (!game) {
      throw new NotFoundException('game not found.');
    }

    return { status: true, message: "game Delete successfully" };
  }
}
