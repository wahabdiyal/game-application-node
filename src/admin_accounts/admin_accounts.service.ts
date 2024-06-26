import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdminAccountDto } from './dto/create-admin_account.dto';
import { UpdateAdminAccountDto } from './dto/update-admin_account.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { AdminAccount } from './schemas/admin_account.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminAccountsService {
  constructor(
    @InjectModel(AdminAccount.name)
    private acoountModel: mongoose.Model<AdminAccount>,
    private userService: UserService,
  ) {}
  async create(createAdminAccountDto: CreateAdminAccountDto) {
    const player = await this.userService.findUserbyId(
      createAdminAccountDto['user_id'],
    );

    const user = await this.userService.findByEmail(process.env.DF_EMAIL);

    if (user.email) {
      let userbal: number =
        createAdminAccountDto['credit'] != '0'
          ? Number(user.gold_balance) + Number(createAdminAccountDto['credit'])
          : Number(user.gold_balance) - Number(createAdminAccountDto['debit']);

      await this.userService.update(user.id, { gold_balance: userbal });

      var res = await this.acoountModel.create({
        ...createAdminAccountDto,
        gold_coin_balance: userbal,
        email: player ? player.email : '',
        transaction_id: Math.random().toString(36).slice(-5),
      });
      return res;
    }
    return { status: false, message: 'Admin mail not found' };
  }

  async rechargeAdminInvestments(createAdminAccountDto: CreateAdminAccountDto) {
    const user = await this.userService.findByEmail(process.env.DF_EMAIL);

    if (user.email) {
      createAdminAccountDto['user_id'] = null;
      createAdminAccountDto['type'] = 'recharge by admin';
      let userbal: number =
        createAdminAccountDto['credit'] != '0'
          ? Number(user.gold_balance) + Number(createAdminAccountDto['credit'])
          : Number(user.gold_balance) - Number(createAdminAccountDto['debit']);

      await this.userService.update(user.id, { gold_balance: userbal });

      var res = await this.acoountModel.create({
        ...createAdminAccountDto,
        gold_coin_balance: userbal,
      });
      return res;
    }
    return { status: false, data: res, message: 'Admin mail not found' };
  }

  async findAll(page = 0, perPage = 20, search = false, date = []) {
    let totalCount = 0;
    if (date.length > 0 && search) {
      let parsedStartDate = new Date(date[0].start);
      let parsedEndDate = new Date(date[0].end);
      totalCount = await this.acoountModel
        .find({
          $or: [
            { transaction_id: { $regex: search, $options: 'i' } }, // Case-insensitive search
            { remarks: { $regex: search, $options: 'i' } }, // Case-insensitive search
            { country: { $regex: search, $options: 'i' } },
          ],
          createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
        })
        .countDocuments()
        .exec();
    } else if (search) {
      totalCount = await this.acoountModel
        .find({
          $or: [
            { transaction_id: { $regex: search, $options: 'i' } }, // Case-insensitive search
            { remarks: { $regex: search, $options: 'i' } }, // Case-insensitive search
            { country: { $regex: search, $options: 'i' } },
          ],
        })
        .countDocuments()
        .exec();
    } else if (date.length > 0) {
      let parsedStartDate = new Date(date[0].start);
      let parsedEndDate = new Date(date[0].end);
      totalCount = await this.acoountModel
        .find({
          createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
        })
        .countDocuments()
        .exec();
    } else {
      totalCount = await this.acoountModel.find().countDocuments().exec();
    }

    const totalPages = Math.ceil(totalCount / perPage);

    if (page < 1) {
      page = 1;
    } else if (page > totalPages) {
      page = totalPages;
    }

    const skip = (page - 1) * perPage;
    let data = [];

    ////collect data
    if (date.length > 0) {
      let parsedStartDate = new Date(date[0].start);
      let parsedEndDate = new Date(date[0].end);
      data = await this.acoountModel
        .find({
          createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
        })
        .populate('user_id')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage)
        .exec();
    } else if (search) {
      data = await this.acoountModel
        .find({
          $or: [
            { transaction_id: { $regex: search, $options: 'i' } }, // Case-insensitive search
            { remarks: { $regex: search, $options: 'i' } }, // Case-insensitive search
            { country: { $regex: search, $options: 'i' } },
          ],
        })
        .populate('user_id')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage)
        .exec();
    } else if (date.length > 0 && search) {
      let parsedStartDate = new Date(date[0].start);
      let parsedEndDate = new Date(date[0].end);
      data = await this.acoountModel
        .find({
          $or: [
            { transaction_id: { $regex: search, $options: 'i' } }, // Case-insensitive search
            { remarks: { $regex: search, $options: 'i' } }, // Case-insensitive search
            { country: { $regex: search, $options: 'i' } },
          ],
          createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
        })
        .populate('user_id')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage)
        .exec();
    } else {
      data = await this.acoountModel
        .find()
        .populate('user_id')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage)
        .exec();
    }

    return {
      data: data,
      currentPage: page,
      totalPages,
      perPage,
      total_count: totalCount,
    };
  }
  async findAllCommission(page = 0, perPage = 20, filter = '') {
    let query = {};
    if (filter == '') {
      query = { type: 'commission' };
    } else {
      query = { type: 'commission', game_id: filter };
    }
    let totalCount = await this.acoountModel
      .find(query)
      .countDocuments()
      .exec();
    const totalPages = Math.ceil(totalCount / perPage);
    if (page < 1) {
      page = 1;
    } else if (page > totalPages) {
      page = totalPages;
    }
    const skip = (page - 1) * perPage;
    let data = [];
    try {
      data = await this.acoountModel
        .find(query)
        .skip(skip)
        .limit(perPage)
        .populate('first_player')
        .populate('second_player')
        .populate('game_id')
        .exec();
    } catch (error) {
      data = [];
    }
    return {
      data: data,
      currentPage: page,
      totalPages,
      perPage,
      total_count: totalCount,
    };
  }

  async getAdminSale(page = 0, perPage = 20, date = [], country = false) {
    let totalCount = 0;
    if (date.length > 0 && country) {
      const parsedStartDate = new Date(date[0].start);
      const parsedEndDate = new Date(date[0].end);

      totalCount = await this.acoountModel
        .find({
          $or: [{ type: 'commission_bet' }, { type: 'commission_withdraw' }],
          createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
          country: country,
        })
        .countDocuments()
        .exec();
    } else if (date.length > 0) {
      const parsedStartDate = new Date(date[0].start);
      const parsedEndDate = new Date(date[0].end);

      totalCount = await this.acoountModel
        .find({
          $or: [{ type: 'commission_bet' }, { type: 'commission_withdraw' }],
          createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
        })
        .countDocuments()
        .exec();
    } else if (country) {
      totalCount = await this.acoountModel
        .find({
          country: country,
        })
        .countDocuments()
        .exec();
    } else {
      totalCount = await this.acoountModel
        .find({
          $or: [{ type: 'commission_bet' }, { type: 'commission_withdraw' }],
        })
        .countDocuments()
        .exec();
    }

    const totalPages = Math.ceil(totalCount / perPage);

    if (page < 1) {
      page = 1;
    } else if (page > totalPages) {
      page = totalPages;
    }

    const skip = (page - 1) * perPage;

    let data = [];
    let sumTotal = 0;
    try {
      if (date.length > 0 && country) {
        const parsedStartDate = new Date(date[0].start);
        const parsedEndDate = new Date(date[0].end);

        data = await this.acoountModel
          .find({
            $or: [{ type: 'commission_bet' }, { type: 'commission_withdraw' }],
            createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
            country: country,
          })
          .skip(skip)
          .limit(perPage)
          .populate('first_player')
          .populate('second_player')
          .populate('game_id')
          .populate('user_id')
          .sort({ createdAt: -1 })
          .exec();
      } else if (country) {
        data = await this.acoountModel
          .find({
            country: country,
          })
          .skip(skip)
          .limit(perPage)
          .populate('first_player')
          .populate('second_player')
          .populate('game_id')
          .populate('user_id')
          .sort({ createdAt: -1 })
          .exec();
      } else if (date.length > 0) {
        const parsedStartDate = new Date(date[0].start);
        const parsedEndDate = new Date(date[0].end);
        data = await this.acoountModel
          .find({
            $or: [{ type: 'commission_bet' }, { type: 'commission_withdraw' }],
            createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
          })
          .skip(skip)
          .limit(perPage)
          .populate('first_player')
          .populate('second_player')
          .populate('game_id')
          .populate('user_id')
          .sort({ createdAt: -1 })
          .exec();
      } else {
        data = await this.acoountModel
          .find({
            $or: [{ type: 'commission_bet' }, { type: 'commission_withdraw' }],
          })
          .skip(skip)
          .limit(perPage)
          .populate('first_player')
          .populate('second_player')
          .populate('game_id')
          .populate('user_id')
          .sort({ createdAt: -1 })
          .exec();
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
      total_sum_commission: data.reduce(
        (acc, obj) => acc + Number(obj.credit),
        0,
      ),
    };
  }
  async findOne(id: any) {
    return await this.acoountModel.findOne({ _id: id });
  }

  async update(id: any, updateAdminAccountDto: UpdateAdminAccountDto) {
    const account = await this.acoountModel.findByIdAndUpdate(
      id,
      updateAdminAccountDto,
    );

    if (!account) {
      throw new NotFoundException('account not found.');
    }

    return { status: true, message: 'account updated successfully' };
  }

  async remove(id: any) {
    const account = await this.acoountModel.findByIdAndDelete(id);

    if (!account) {
      throw new NotFoundException('account not found.');
    }

    return { status: true, message: 'account Delete successfully' };
  }
  async getLatestEntry(): Promise<any> {
    try {
      const latestRecord = await this.acoountModel
        .findOne()
        .sort({ createdAt: -1 })
        .exec();
      return latestRecord;
    } catch (error) {
      throw new Error(`Error finding the latest record: ${error.message}`);
    }
  }
}
