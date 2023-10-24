import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePurchaseRequestDto } from './dto/create-purchase_request.dto';
import { UpdatePurchaseRequestDto } from './dto/update-purchase_request.dto';
import mongoose from 'mongoose';
import { PurchaseRequests } from './schemas/purchase_requests.schema';
import { InjectModel } from '@nestjs/mongoose';
import { AdminAccountsService } from 'src/admin_accounts/admin_accounts.service';
import { GoldsService } from 'src/golds/golds.service';
import { SilversService } from 'src/silvers/silvers.service';
import { UserService } from 'src/user/user.service';


@Injectable()
export class PurchaseRequestsService {
  constructor(
    @InjectModel(PurchaseRequests.name)
    private purchasemModel: mongoose.Model<PurchaseRequests>,
    private adminAccountService: AdminAccountsService,
    private userService: UserService,
    private goldService: GoldsService,
    private silverService: SilversService,
  ) { }
  async create(createPurchaseDto: CreatePurchaseRequestDto) {
    const user = await this.userService.findUserbyId(createPurchaseDto['user_id']);
    if (!user) {
      return new NotFoundException("User not found");
    }
    const getOperator = await this.userService.findOperatorWithCountry(user.country);
    const singleArrayValue = getOperator.reduce((acc, item) => {
      acc.push(item.userId);
      return acc;
    }, []);
    createPurchaseDto['country'] = user.country;
    createPurchaseDto['first_name'] = user.first_name;
    createPurchaseDto['last_name'] = user.last_name;
    createPurchaseDto['userId'] = user.userId;
    // createPurchaseDto['transaction_id'] =Math.random().toString(36).slice(-1)+Math.random().toString(36).slice(-1)+Math.random().toString(36).slice(-1)+Math.random().toString(36).slice(-1)+Math.random().toString(36).slice(-1);
    createPurchaseDto['operator'] = singleArrayValue;
    var res = await this.purchasemModel.create(createPurchaseDto);
    return res;
  }

  async findAll() {
    return await this.purchasemModel.find();
  }

  async findOne(id: any) {
    return await this.purchasemModel.findById(id);
  }

  async update(id: any, updatePurchaseDto: UpdatePurchaseRequestDto) {
    const object = await this.purchasemModel.findOne({ _id: id });

    ////update object
    await this.purchasemModel.findByIdAndUpdate(id, updatePurchaseDto);

    if (updatePurchaseDto['status'] === "approved") {
      ////admin debit admin wallet
      await this.adminAccountService.create({
        "remarks": "purchase approved, TrD:" + id,
        "debit": object['gold_coin'],
        "credit": 0,
        "user_id": object['user_id'],
      });
      //credit player
      await this.goldService.create({
        "client_id": object['user_id'],
        "entry_by": "admin",
        "remarks": "purchase approved, TrD:" + id,
        "type": "credit",
        "status": "complete",
        "coins": object['gold_coin'],
      });
      await this.silverService.create({
        "client_id": object['user_id'],
        "entry_by": "admin",
        "remarks": "purchase approved, TrD:" + id,
        "type": "credit",
        "status": "complete",
        "coins": object['silver_coin'],
      });

    }
    else {
      if (object.status === 'approved') {
        await this.goldService.create({
          "client_id": object['user_id'],
          "entry_by": "admin",
          "remarks": "purchase reversed, Trd:" + id,
          "type": "debit",
          "status": "complete",
          "coins": object['gold_coin'],
        });
        await this.silverService.create({
          "client_id": object['user_id'],
          "entry_by": "admin",
          "remarks": "purchase approved, TrD:" + id,
          "type": "debit",
          "status": "complete",
          "coins": object['silver_coin'],
        });
      }
    }
    const data = await this.purchasemModel.findById(id);

    return { status: true, data: data, message: "updated" };
  }

  async remove(id: any) {
    const request = await this.purchasemModel.findByIdAndDelete(id);

    if (!request) {
      throw new NotFoundException('Purchase request not found.');
    }

    return { status: true, message: "request Delete successfully" };
  }
  async findByUser(user_id) {
    const user = await this.purchasemModel.find({ user_id: user_id }).sort({ createdAt: -1 });
    return user;
  }
  async findByStatus(page = 0, perPage = 20, date = [], status = false, search = false) {

    let totalCount = 0
    if (date.length > 0 && status && search) {
      const parsedStartDate = new Date(date[0].start);
      const parsedEndDate = new Date(date[0].end);

      totalCount = await this.purchasemModel.find({
        createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
        status: status,
        $or: [
          { userId: { $regex: search, $options: 'i' } },
          { country: { $regex: search, $options: 'i' } },
          { first_name: { $regex: search, $options: 'i' } },
          { last_name: { $regex: search, $options: 'i' } },
          { transaction_id: { $regex: search, $options: 'i' } },
          { purchase_id: { $regex: search, $options: 'i' } },
        ],
      }).countDocuments().exec();

    } else if (date.length > 0 && search) {
      const parsedStartDate = new Date(date[0].start);
      const parsedEndDate = new Date(date[0].end);
      totalCount = await this.purchasemModel.find({
        createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
        $or: [
          { userId: { $regex: search, $options: 'i' } },
          { country: { $regex: search, $options: 'i' } },
          { first_name: { $regex: search, $options: 'i' } },
          { last_name: { $regex: search, $options: 'i' } },
          { transaction_id: { $regex: search, $options: 'i' } },
          { purchase_id: { $regex: search, $options: 'i' } },
        ],
      }).countDocuments().exec();

    } else if (search && status) {
      totalCount = await this.purchasemModel.find({
        status: status,
        $or: [
          { userId: { $regex: search, $options: 'i' } },
          { country: { $regex: search, $options: 'i' } },
          { first_name: { $regex: search, $options: 'i' } },
          { last_name: { $regex: search, $options: 'i' } },
          { transaction_id: { $regex: search, $options: 'i' } },
          { purchase_id: { $regex: search, $options: 'i' } },
        ],
      }).countDocuments().exec();
    } else if (date.length > 0 && status) {
      const parsedStartDate = new Date(date[0].start);
      const parsedEndDate = new Date(date[0].end);

      totalCount = await this.purchasemModel.find({
        createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
        status: status
      }).countDocuments().exec();
    } else if (date.length > 0) {

      const parsedStartDate = new Date(date[0].start);
      const parsedEndDate = new Date(date[0].end);

      totalCount = await this.purchasemModel.find({
        createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
      }).countDocuments().exec();
    } else if (search) {
      totalCount = await this.purchasemModel.find({
        $or: [
          { userId: { $regex: search, $options: 'i' } },
          { country: { $regex: search, $options: 'i' } },
          { first_name: { $regex: search, $options: 'i' } },
          { last_name: { $regex: search, $options: 'i' } },
          { transaction_id: { $regex: search, $options: 'i' } },
          { purchase_id: { $regex: search, $options: 'i' } },
        ],
      }).countDocuments().exec();
    } else if (status) {
      totalCount = await this.purchasemModel.find({
        status: status,
      }).countDocuments().exec();
    } else {
      totalCount = await this.purchasemModel.find().countDocuments().exec();
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
      if (date.length > 0 && status && search) {
        const parsedStartDate = new Date(date[0].start);
        const parsedEndDate = new Date(date[0].end);

        data = await this.purchasemModel.find({
          createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
          status: status,
          $or: [
            { userId: { $regex: search, $options: 'i' } },
            { country: { $regex: search, $options: 'i' } },
            { first_name: { $regex: search, $options: 'i' } },
            { last_name: { $regex: search, $options: 'i' } },
            { transaction_id: { $regex: search, $options: 'i' } },
          { purchase_id: { $regex: search, $options: 'i' } },
          ],
        }).sort({ createdAt: -1 }).skip(skip).limit(perPage).exec();
      } else if (date.length > 0 && search) {
        const parsedStartDate = new Date(date[0].start);
        const parsedEndDate = new Date(date[0].end);

        data = await this.purchasemModel.find({
          createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
          $or: [
            { userId: { $regex: search, $options: 'i' } },
            { country: { $regex: search, $options: 'i' } },
            { first_name: { $regex: search, $options: 'i' } },
            { last_name: { $regex: search, $options: 'i' } },
            { transaction_id: { $regex: search, $options: 'i' } },
          { purchase_id: { $regex: search, $options: 'i' } },
          ],
        }).sort({ createdAt: -1 }).skip(skip).limit(perPage).exec();
      } else if (status && search) {

        data = await this.purchasemModel.find({
          status: status,
          $or: [
            { userId: { $regex: search, $options: 'i' } },
            { country: { $regex: search, $options: 'i' } },
            { first_name: { $regex: search, $options: 'i' } },
            { last_name: { $regex: search, $options: 'i' } },
            { transaction_id: { $regex: search, $options: 'i' } },
          { purchase_id: { $regex: search, $options: 'i' } },
          ],
        }).sort({ createdAt: -1 }).skip(skip).limit(perPage).exec();
      } else if (date.length > 0 && status) {
        const parsedStartDate = new Date(date[0].start);
        const parsedEndDate = new Date(date[0].end);

        data = await this.purchasemModel.find({
          createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
          status: status
        }).sort({ createdAt: -1 }).skip(skip).limit(perPage).exec();
      } else if (search) {
        data = await this.purchasemModel.find({
          $or: [
            { userId: { $regex: search, $options: 'i' } },
            { country: { $regex: search, $options: 'i' } },
            { first_name: { $regex: search, $options: 'i' } },
            { last_name: { $regex: search, $options: 'i' } },
            { transaction_id: { $regex: search, $options: 'i' } },
          { purchase_id: { $regex: search, $options: 'i' } },
          ],
        }).populate({
          path: 'operator',
          populate: { path: 'operator' }
        }).sort({ createdAt: -1 }).skip(skip).limit(perPage).exec();
      } else if (status) {
        data = await this.purchasemModel.find({
          status: status
        }).sort({ createdAt: -1 }).skip(skip).limit(perPage).exec();
      } else if (date.length > 0) {
        const parsedStartDate = new Date(date[0].start);
        const parsedEndDate = new Date(date[0].end);
        data = await this.purchasemModel.find({
          createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
        }).populate({
          path: 'operator',

          populate: { path: 'operator' }
        }).sort({ createdAt: -1 }).skip(skip).limit(perPage).exec();

      } else {
        data = await this.purchasemModel.find().sort({ createdAt: -1 }).skip(skip).limit(perPage).exec();
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
}
