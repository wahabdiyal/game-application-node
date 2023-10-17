import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCreateLogDto } from './dto/create-create-log.dto';
import { UpdateCreateLogDto } from './dto/update-create-log.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from "src/user/schemas/user.schema";
import mongoose from 'mongoose';
import { CreateLogs } from './schemas/create-logs.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CreateLogsService {
  constructor(
    @InjectModel(CreateLogs.name)
    private createLogsModal: mongoose.Model<CreateLogs>,
    private userService: UserService,
  ) { }
  async create(createCreateLogDto: CreateCreateLogDto) {
    const user = await this.userService.findUserbyId(createCreateLogDto['user']);

    if (!user) {
      return new NotFoundException("User not found");
    }

    createCreateLogDto['operator_name'] = user.first_name + ' ' + user.last_name;
    createCreateLogDto['country'] = user.country;
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
}
