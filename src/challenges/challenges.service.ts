import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
 
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Challenges } from './schemas/challenges.schema';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel(Challenges.name)
    private challengeModel: mongoose.Model<Challenges>,
  ) { }

  async create(createChallengeDto: CreateChallengeDto) {

    var res = await this.challengeModel.create(createChallengeDto);
    return res;
  }

  async findAll() {
    return await this.challengeModel.find();
  }

  async findOne(id: any) {
    return await this.challengeModel.findOne({ _id: id });
  }

  async update(id: any, updateChallengeDto: UpdateChallengeDto) {
    const challenge = await this.challengeModel.findByIdAndUpdate(id, updateChallengeDto);

    if (!challenge) {
      throw new NotFoundException('challenge not found.');
    }

    const object = await this.challengeModel.findOne(challenge._id);

    return { status: true, data: object, message: "challenge updated successfully" };
  }

  async remove(id: any) {
    const challenge = await this.challengeModel.findByIdAndDelete(id);

    if (!challenge) {
      throw new NotFoundException('challenge not found.');
    }

    return { status: true, message: "challenge Delete successfully" };
  }

  async getchallengeList(list: any) {
    const challengeList = await this.challengeModel.find({ _id: list });
    return challengeList;
  }
}
 
 