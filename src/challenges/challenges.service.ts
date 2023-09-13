import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';

import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Challenges } from './schemas/challenges.schema';
import { Games } from 'src/games/schemas/games.schema';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel(Challenges.name) private challengeModel: mongoose.Model<Challenges>,
    @InjectModel(Games.name) private gameModel: mongoose.Model<Games>, // Corrected model type
    @InjectModel(User.name) private userModel: mongoose.Model<User>,
  ) { }

  async create(createChallengeDto: CreateChallengeDto) {
    /////collect game_info
    const game = await this.gameModel.findOne({ _id: createChallengeDto['game_id'] });

    ///////check for block status allow_to_game from `user` by challenger_id
    const player = await this.userModel.findOne({ _id: createChallengeDto['challenger_id'] });
    if (!player.allow_to_game && new Date(player.restriction_end_at) > new Date()) {
      const blocked_time = new Date(player.game_restrict_at);
      const unBlock_time = new Date(player.restriction_end_at);
      console.log(blocked_time);
      console.log(unBlock_time);
      const timeDifferenceM: any = (unBlock_time.getTime() - new Date().getTime()) / 60000;
      return 'challenges blocked for ' + timeDifferenceM + ' mints'
    } else {
      await this.un_restrictUserForChallenges(createChallengeDto['challenger_id'])
    }

    /////check for maximum challenges limit
    const challenge = await this.checkForChallenges(createChallengeDto['challenger_id'], parseInt(game.maximum_challenges))
    if (challenge === true)
      return 'exceed maximum challenges please wait..'



    /////restrictions
    //allow_to_game from `user` by challenger_id

    //////add derived fields
    createChallengeDto['game_title'] = game.title;
    createChallengeDto['challenge_time_minutes'] = game.challenge_time_minutes;
    createChallengeDto['maximum_challenges'] = game.maximum_challenges;
    createChallengeDto['commission'] = game.commission;
    createChallengeDto['time_restrictions'] = game.time_restrictions;
    //////add derived fields



    // console.log(game);
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


  async checkForChallenges(user_id: string, maximum_limits: number) {
    const total_challenges = await this.challengeModel.countDocuments({ challenger_id: user_id });
    if (maximum_limits < total_challenges)
      return true;
    else
      return false;
    // return count > maximum_limits;
  }

  async restrictUserForChallenges(user_id: string, restriction_time_mints: number) {
    await this.userModel.updateOne({ _id: user_id },
      {
        allow_to_game: false,
        game_restrict_at: new Date(),
        restriction_end_at: new Date(new Date().getTime() + restriction_time_mints * 60000),
      }
    )
    return "user restricted for " + restriction_time_mints + " mints"
  }
  async removeExpireChallenges() {
    // return await this.challengeModel.find({ challenger_id: 'hello' });
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000); // Calculate the date 10 minutes ago

    const challenges = await this.challengeModel.deleteMany({
      createdAt: { $lt: tenMinutesAgo }, // Use the $lt operator to filter records created before tenMinutesAgo
    });

    return challenges;
  }
  async un_restrictUserForChallenges(user_id: string) {
    await this.userModel.updateOne({ _id: user_id },
      {
        allow_to_game: true,
        game_restrict_at: '',
        restriction_end_at: '',
      }
    )
    return true
  }
}

