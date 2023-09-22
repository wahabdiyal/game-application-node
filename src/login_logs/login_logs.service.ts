import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLoginLogDto } from './dto/create-login_log.dto';
import { UpdateLoginLogDto } from './dto/update-login_log.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { LoginLogs } from './schemas/login_logs.schema';

@Injectable()
export class LoginLogsService {
  constructor(
    @InjectModel(LoginLogs.name)
    private loginLogsModal: mongoose.Model<LoginLogs>,
  ) { }

  async create(createLoginLogDto: CreateLoginLogDto) {
    var res = await this.loginLogsModal.create(createLoginLogDto);
    return await this.loginLogsModal.findOne({ _id: res._id }).populate('user');
  }
  async findByCountry(country: string) {
    return await this.loginLogsModal.find({ country: country });
  }
  async findAll() {
    return await this.loginLogsModal.find().populate('user');
  }
  async findOne(id: any) {
    return await this.loginLogsModal.findOne({ _id: id });
  }
  async update(id: any, updateLoginLogDto: UpdateLoginLogDto) {
    const log = await this.loginLogsModal.findByIdAndUpdate(id, updateLoginLogDto);

    if (!log) {
      throw new NotFoundException('not found.');
    }
    const data = await this.loginLogsModal.findOne({ _id: id }).populate('user');;

    return { status: true, data: data, message: "updated" };
  }

  async remove(id: any) {
    const log = await this.loginLogsModal.findByIdAndDelete(id);

    if (!log) {
      throw new NotFoundException('not found.');
    }

    return { status: true, message: "removed" };

  }
  async operatorsVisits() {
    return await this.loginLogsModal.aggregate([
      {
        $lookup: {
          from: 'users', // Assuming your User collection is named 'users'
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $group: {
          _id: '$user.country',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 }, // Sort by count in descending order
      },
    ])
      .exec()
  }
}

