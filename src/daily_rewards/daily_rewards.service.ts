import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDailyRewardDto } from './dto/create-daily_reward.dto';
import { UpdateDailyRewardDto } from './dto/update-daily_reward.dto';
import { InjectModel } from '@nestjs/mongoose';
import { DailyReward } from './schemas/daily-rewards.schema';
import mongoose from 'mongoose';

@Injectable()
export class DailyRewardsService {
  constructor(
    @InjectModel(DailyReward.name)
    private dailyReward: mongoose.Model<DailyReward>,
  ) { }

  async create(createDailyRewardDto: CreateDailyRewardDto) {
    let collection = await this.dailyReward.find({});
    const startinput = new Date(createDailyRewardDto['start_date']).getTime();
    const endinput = new Date(createDailyRewardDto['end_date']).getTime();
    const matchedCollection = [];
    for (const item of collection) {
      const startdb = new Date(item['start_date']).getTime();
      const enddb = new Date(item['end_date']).getTime();
      if (
        (startinput >= startdb && startinput <= enddb)
        ||
        (endinput >= startdb && endinput <= enddb)
        ||
        (startinput <= startdb && endinput >= startdb)
        ||
        (startinput <= enddb && endinput >= enddb)
      ) {
        matchedCollection.push(item);
      }
    }
    function checkRecordExists(records, criteria) {
      const [countries, startTime, endTime] = criteria;
      const isInRange = function (date, start, end) {
        return date.isBetween(start, end, undefined, '[');
      };
      for (let x = 0; x < records.length; x++) {
        const record = records[x];
        for (let m = 0; m < record.country.length; m++) {
          const ctry = record.country[m];
          for (let usrcty = 0; usrcty < countries.length; usrcty++) {
            const element = countries[usrcty];
            if (element.toLowerCase() == ctry.toLowerCase()) {
              return true;
            }
          }
        }
      }
      return false;
    }
    const inputArray = createDailyRewardDto['country'];

    const uniqueLowerCaseArray = [...new Set(inputArray.map(item => item.toLowerCase()))];


    const searchCriteria = [uniqueLowerCaseArray, createDailyRewardDto['start_date'], createDailyRewardDto['end_date']];
    const val = checkRecordExists(matchedCollection, searchCriteria);
    if (!val) {
      var res = await this.dailyReward.create({
        ...createDailyRewardDto,
        start_date: new Date(createDailyRewardDto['start_date']),
        end_date: new Date(createDailyRewardDto['end_date']),
        country: uniqueLowerCaseArray
      });
      return res;
    } else {
      return { "status": false, "message": "Please select unique country" }
    }
  }

  async findAll(type) {

    if (type == "silver") {
      return await this.dailyReward.find({ silver_coin: { $ne: 0 } }).exec();
    } if (type == "gold") {
      return await this.dailyReward.find({ gold_coin: { $ne: 0 } }).exec();
    }
    return [];

  }

  async findAllTypes() {
    return await this.dailyReward.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: any) {
    return await this.dailyReward.findOne({ _id: id });
  }

  async update(id: any, updateDailyRewardDto: UpdateDailyRewardDto) {
    const dailyreward = await this.dailyReward.findByIdAndUpdate(id, updateDailyRewardDto);

    if (!dailyreward) {
      throw new NotFoundException('daily reward not found.');
    }
    const data = await this.dailyReward.findOne({ _id: id });

    return { status: true, data: data, message: "daily reward updated successfully" };
  }

  async remove(id: any) {
    const dailyreward = await this.dailyReward.findByIdAndDelete(id);
    if (!dailyreward) {
      throw new NotFoundException('daily reward not found.');
    }

    return { status: true, message: "daily reward delete successfully" };
  }

  async findByCountry(country) {
    return await this.dailyReward.findOne({
      country: {
        $in: [country]
      }
    });
  }
  async findUserCountry(country) {
    const now = new Date();
    return await this.dailyReward.findOne({
      country: { $in: [country] },
      start_date: { $lte: now.toISOString() },
      end_date: { $gte: now.toISOString() },
    });
  }

  async findForMobile(country: any) {
    const currentDate = new Date();
    const reward = await this.dailyReward.findOne({
      country: country,
      start_date: { $lte: currentDate }, // start_date is  than or equal to the current date
      end_date: { $gte: currentDate } // Check if end_date is greater than or equal to the current date
    });
    if (reward)
      return {
        status: true,
        message: "daily reward found",
        title: reward['title'],
        dailyRewardStatus: reward['status'],
        silver: reward['silver_coin'],
        gold: reward['gold_coin'],
        inactive_day: reward['inactive_day'],
        description: reward['description'],
        country: country,

      }
    else
      return {
        status: false,
        message: "daily reward not found",
        title: "",
        dailyRewardStatus: "",
        silver: "",
        gold: "",
        inactive_day: "",
        description: "",
        country: country,

      }
  }

}
