import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCreateLogDto } from './dto/create-create-log.dto';
import { UpdateCreateLogDto } from './dto/update-create-log.dto';
import { InjectModel } from '@nestjs/mongoose';

import mongoose from 'mongoose';
import { CreateLogs } from './schemas/create-logs.schema';
import { UserService } from 'src/user/user.service';

import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule/dist';
import { OnEvent } from '@nestjs/event-emitter/dist/decorators';
import { DailyRewardCollect } from 'src/daily_reward_collects/daily_reward_collects.event';
@Injectable()
export class CreateLogsService {
  constructor(
    @InjectModel(CreateLogs.name)
    private createLogsModal: mongoose.Model<CreateLogs>,
    private userService: UserService,
    private readonly eventEmitter: EventEmitter2
  ) { }
  async create(createCreateLogDto: CreateCreateLogDto) {
    const user = await this.userService.findUserbyId(createCreateLogDto['user']);

    if (!user) {
      return new NotFoundException("User not found");
    }

    createCreateLogDto['operator_name'] = user.first_name + ' ' + user.last_name;
    createCreateLogDto['country'] = user.country;
    createCreateLogDto['operator_email'] = user.email;
    return await this.createLogsModal.create(createCreateLogDto);
  }
  async findAll(page = 0, perPage = 20, date = [], search = false, countryName = false) {
    let totalCount = 0



    if (date.length > 0) {
      const parsedStartDate = new Date(date[0].start);
      const parsedEndDate = new Date(date[0].end);

      totalCount = await this.createLogsModal.find({
        createdAt: { $gte: parsedStartDate, $lte: parsedEndDate }
      }).countDocuments().exec();
    }
    else if (search) {
      totalCount = await this.createLogsModal.find({
        $or: [
          { operator_name: { $regex: search, $options: 'i' } },
          { operator_email: { $regex: search, $options: 'i' } },
          { url: { $regex: search, $options: 'i' } },
          { country: { $regex: search, $options: 'i' } }
        ],
      }).countDocuments().exec();
    }
    else if (countryName) {
      totalCount = await this.createLogsModal.find({ country: countryName }).countDocuments().exec();
    }
    else if (date.length > 0 && search) {
      const parsedStartDate = new Date(date[0].start);
      const parsedEndDate = new Date(date[0].end);
      totalCount = await this.createLogsModal.find({
        $or: [
          { operator_name: { $regex: search, $options: 'i' } },
          { url: { $regex: search, $options: 'i' } },
          { operator_email: { $regex: search, $options: 'i' } },
          { country: { $regex: search, $options: 'i' } }
        ],
        createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
      }).countDocuments().exec();
    }
    else if (date.length > 0 && countryName) {
      const parsedStartDate = new Date(date[0].start);
      const parsedEndDate = new Date(date[0].end);
      totalCount = await this.createLogsModal.find({
        country: countryName,
        createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
      }).countDocuments().exec();
    }
    else if (search && countryName) {
      totalCount = await this.createLogsModal.find({
        $or: [
          { operator_name: { $regex: search, $options: 'i' } },
          { url: { $regex: search, $options: 'i' } },
          { operator_email: { $regex: search, $options: 'i' } },
          { country: { $regex: search, $options: 'i' } }
        ],
        country: countryName,
      }).countDocuments().exec();
    }
    else if (date.length > 0 && search && countryName) {
      const parsedStartDate = new Date(date[0].start);
      const parsedEndDate = new Date(date[0].end);
      totalCount = await this.createLogsModal.find({
        $or: [
          { operator_name: { $regex: search, $options: 'i' } },
          { url: { $regex: search, $options: 'i' } },
          { operator_email: { $regex: search, $options: 'i' } },
          { country: { $regex: search, $options: 'i' } }
        ],
        country: countryName,
        createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
      }).countDocuments().exec();
    }
    else {
      totalCount = await this.createLogsModal.find().countDocuments().exec();
    }

    const totalPages = Math.ceil(totalCount / perPage);

    if (page < 1) {
      page = 1;
    } else if (page > totalPages) {
      page = totalPages;
    }

    const skip = (page - 1) * perPage;

    let data = [];
    try {

      if (date.length > 0) {
        const parsedStartDate = new Date(date[0].start);
        const parsedEndDate = new Date(date[0].end);

        data = await this.createLogsModal.find({
          createdAt: { $gte: parsedStartDate, $lte: parsedEndDate }
        }).populate('user').sort({ createdAt: -1 }).skip(skip).limit(perPage).exec();
      }
      else if (search) {
        data = await this.createLogsModal.find({
          $or: [
            { operator_name: { $regex: search, $options: 'i' } },
            { operator_email: { $regex: search, $options: 'i' } },
            { url: { $regex: search, $options: 'i' } },
            { country: { $regex: search, $options: 'i' } }
          ],
        }).populate('user').sort({ createdAt: -1 }).skip(skip).limit(perPage).exec();
      }
      else if (countryName) {
        data = await this.createLogsModal.find({ country: countryName }).populate('user').sort({ createdAt: -1 }).skip(skip).limit(perPage).exec();
      }
      else if (date.length > 0 && search) {
        const parsedStartDate = new Date(date[0].start);
        const parsedEndDate = new Date(date[0].end);
        data = await this.createLogsModal.find({
          $or: [
            { operator_name: { $regex: search, $options: 'i' } },
            { operator_email: { $regex: search, $options: 'i' } },
            { url: { $regex: search, $options: 'i' } },
            { country: { $regex: search, $options: 'i' } }
          ],
          createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
        }).populate('user').sort({ createdAt: -1 }).skip(skip).limit(perPage).exec();
      }
      else if (date.length > 0 && countryName) {
        const parsedStartDate = new Date(date[0].start);
        const parsedEndDate = new Date(date[0].end);
        data = await this.createLogsModal.find({
          country: countryName,
          createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
        }).populate('user').sort({ createdAt: -1 }).skip(skip).limit(perPage).exec();
      }
      else if (search && countryName) {
        data = await this.createLogsModal.find({
          $or: [
            { operator_name: { $regex: search, $options: 'i' } },
            { operator_email: { $regex: search, $options: 'i' } },
            { url: { $regex: search, $options: 'i' } },
            { country: { $regex: search, $options: 'i' } }
          ],
          country: countryName,
        }).populate('user').sort({ createdAt: -1 }).skip(skip).limit(perPage).exec();
      }
      else if (date.length > 0 && search && countryName) {
        const parsedStartDate = new Date(date[0].start);
        const parsedEndDate = new Date(date[0].end);
        data = await this.createLogsModal.find({
          $or: [
            { operator_name: { $regex: search, $options: 'i' } },
            { operator_email: { $regex: search, $options: 'i' } },
            { url: { $regex: search, $options: 'i' } },
            { country: { $regex: search, $options: 'i' } }
          ],
          country: countryName,
          createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
        }).populate('user').sort({ createdAt: -1 }).skip(skip).limit(perPage).exec();
      }
      else {
        data = await this.createLogsModal.find().populate('user').sort({ createdAt: -1 }).skip(skip).limit(perPage).exec();
      }

    } catch (error) {
      date = [];
    }
    return {
      data: data,
      currentPage: page,
      totalPages,
      perPage,
      total_count: totalCount,
    };
  }



  async findOne(id: any) {
    return await this.createLogsModal.findById(id);

  }
  async findOneByCountry(country: string) {
    return await this.createLogsModal.findOne({ country: country });
  }

  async update(id: any, updateCreateLogDto: UpdateCreateLogDto) {
    const country = await this.createLogsModal.findByIdAndUpdate(id, updateCreateLogDto);

    if (!country) {
      throw new NotFoundException('not found.');
    }

    return { status: true, message: "updated" };
  }

  async remove(id: any) {
    const country = await this.createLogsModal.findByIdAndDelete(id);

    if (!country) {
      throw new NotFoundException('not found.');
    }

    return { status: true, message: "Delete" };
  }
  async verifyOperatorsHourEvents(id: any) {
    const logs = await this.createLogsModal
      .findOne({ user: id })
      .sort({ createdAt: -1 });


    if (logs && logs['createdAt']) {
      const createdAt: any = new Date(logs['createdAt']);
      const currentTime: any = new Date();
      const timeDifference = currentTime - createdAt;

      // Calculate the time difference in milliseconds
      const oneHourInMilliseconds = 60 * 60 * 1000;

      if (timeDifference > oneHourInMilliseconds) {
        return { status: false, message: "no clicked till last hour" };
      } else {
        return { status: true, message: "Not more than one hour ago" };
      }
    } else {
      return { status: false, message: "Delete" };
    }

    // if (!country) {
    //   throw new NotFoundException('not found.');
    // }

    return { status: true, message: "Delete" };
  }


  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT, { name: "action-log-del" })
  async sendRequest() {

    this.eventEmitter.emit(
      'del.logs',
      new DailyRewardCollect(),
    );
    console.log("Delete logs send request.....");
  }
  @OnEvent("del.logs")
  async eventDailyReward(payload: DailyRewardCollect) {
    const sixMonthsAgo = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000); // delete last 6 months records in collection
    const query = { createdAt: { $lt: sixMonthsAgo } };
    const del = await this.createLogsModal.deleteMany(query);
    console.log(del);
    ///////this getUserDailyReward belongs to daily_reward_collects.event.ts//////////////
    ///// just print action finished /////////////////
    return payload.getUserDailyReward();

  }
}
