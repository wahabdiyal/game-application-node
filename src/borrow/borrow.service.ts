import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { UpdateBorrowDto } from './dto/update-borrow.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Borrow } from './schemas/borrow.schema';
import mongoose from 'mongoose';
import { SilversService } from 'src/silvers/silvers.service';
import { GoldsService } from 'src/golds/golds.service';
import { UserService } from 'src/user/user.service';
import { BorrowStatusService } from 'src/borrow_status/borrow_status.service';

@Injectable()
export class BorrowService {
  constructor(
    @InjectModel(Borrow.name)
    private borrowModel: mongoose.Model<Borrow>,
    private silverService: SilversService,
    private goldService: GoldsService,
    private userService: UserService,
    private borrowStatusSerivcie: BorrowStatusService
  ) { }

  async create(createborrowDto: CreateBorrowDto) {
    const borrowStatus = await this.borrowStatusSerivcie.findLastTransaction();

    if (Number(createborrowDto['gold_coin']) != 0 && borrowStatus.gold_status == "false") {
      return { check: false, message: "Borrow gold service not available" }
    }
    const user = await this.userService.findUserbyId(createborrowDto['sender']);
    const u = user && (Number(user.silver_balance) >= Number(createborrowDto['silver_coin'])) && (Number(user.gold_balance) >= Number(createborrowDto['gold_coin']));

    if (!u) {
      return { check: false, message: "Coin are not match with request" };
    }
    if (createborrowDto['status'] != 'pending') {
      await this.goldService.create({ client_id: createborrowDto['sender'], entry_by: "admin", remarks: "borrow request TrD:" + borrowStatus['_id'], type: "debit", status: "success", coins: createborrowDto['gold_coin'], transaction_id: createborrowDto['transaction_id'], transaction_status: "borrowed" });

      await this.goldService.create({ client_id: createborrowDto['receiver'], entry_by: "admin", remarks: "borrow request TrD:" + borrowStatus['_id'], type: "credit", status: "success", coins: createborrowDto['gold_coin'], transaction_id: createborrowDto['transaction_id'], transaction_status: "borrowed" });

      await this.silverService.create({ client_id: createborrowDto['sender'], entry_by: "admin", remarks: "borrow request TrD:" + borrowStatus['_id'], type: "debit", status: "success", coins: createborrowDto['silver_coin'], transaction_id: createborrowDto['transaction_id'], transaction_status: "borrowed" });

      await this.silverService.create({ client_id: createborrowDto['receiver'], entry_by: "admin", remarks: "borrow request TrD:" + borrowStatus['_id'], type: "credit", status: "success", coins: createborrowDto["silver_coin"], transaction_id: createborrowDto['transaction_id'], transaction_status: "borrowed" });

    }
    delete createborrowDto['_id'];
    delete createborrowDto['createdAt'];
    delete createborrowDto['updatedAt'];


    var res = await this.borrowModel.create({ ...createborrowDto, transaction_id: Math.random().toString(36).slice(-5), });
    return { ...res.toObject(), check: true };
  }

  async findAll(page = 0, perPage = 20, date = [], search = false) {

    let data: any = [];
    let totalCount: number = 0;
    let totalPages: number = 0;

    if (date.length > 0 && search) {
      const parsedStartDate = new Date(date[0].start);
      const parsedEndDate = new Date(date[0].end);
      totalCount = await this.borrowModel.find({
        $or: [
          { type: { $regex: search, $options: 'i' } },
          { status: { $regex: search, $options: 'i' } },
          { remarks: { $regex: search, $options: 'i' } },
          { transaction_id: { $regex: search, $options: 'i' } },
        ],
        createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
      }).countDocuments().exec();

      totalPages = Math.ceil(totalCount / perPage);

      if (page < 1) page = 1; if (page > totalPages) page = totalPages

      const skip = (page - 1) * perPage;

      data = await this.borrowModel.find({
        $or: [
          { type: { $regex: search, $options: 'i' } },
          { status: { $regex: search, $options: 'i' } },
          { remarks: { $regex: search, $options: 'i' } },
          { transaction_id: { $regex: search, $options: 'i' } },
        ],
        createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
      }).skip(skip).limit(perPage).populate('sender')
        .populate('receiver').exec();
    }
    else if (date.length > 0) {
      const parsedStartDate = new Date(date[0].start);
      const parsedEndDate = new Date(date[0].end);

      totalCount = await this.borrowModel.find({
        createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
      }).countDocuments().exec();

      totalPages = Math.ceil(totalCount / perPage);

      if (page < 1) page = 1; if (page > totalPages) page = totalPages

      const skip = (page - 1) * perPage;

      data = await this.borrowModel.find({
        createdAt: { $gte: parsedStartDate, $lte: parsedEndDate }
      }).skip(skip).limit(perPage).populate('sender')
        .populate('receiver').exec();
    }
    else if (search) {
      totalCount = await this.borrowModel.find({
        $or: [
          { type: { $regex: search, $options: 'i' } },
          { status: { $regex: search, $options: 'i' } },
          { remarks: { $regex: search, $options: 'i' } },
          { transaction_id: { $regex: search, $options: 'i' } },
        ]
      }).countDocuments().exec();

      totalPages = Math.ceil(totalCount / perPage);

      if (page < 1) page = 1; if (page > totalPages) page = totalPages

      const skip = (page - 1) * perPage;

      data = await this.borrowModel.find({
        $or: [
          { type: { $regex: search, $options: 'i' } },
          { status: { $regex: search, $options: 'i' } },
          { remarks: { $regex: search, $options: 'i' } },
          { transaction_id: { $regex: search, $options: 'i' } },
        ]
      }).skip(skip).limit(perPage).populate('sender')
        .populate('receiver').exec();
    }
    else {

      totalCount = await this.borrowModel.find().countDocuments().exec();

      totalPages = Math.ceil(totalCount / perPage);

      if (page < 1) page = 1; if (page > totalPages) page = totalPages

      const skip = ((page - 1) * perPage) < 0 ? 0 : ((page - 1) * perPage);

      data = await this.borrowModel
        .find()
        .skip(skip)
        .limit(perPage)
        .populate('sender') // Replace 'sender' with the actual path in your schema
        .populate('receiver') // Replace 'receiver' with the actual path in your schema
        .exec();

    }



    return {
      data: data,
      currentPage: page,
      totalPages,
      perPage,
      total_count: totalCount,
    };

    return await this.borrowModel.find()

  }


  async findOne(id: any) {

    return await this.borrowModel.findById(id);
  }

  async update(id: any, updateborrowDto: UpdateBorrowDto) {
    const borrow = await this.borrowModel.findByIdAndUpdate(id, updateborrowDto);


    if (!borrow) {
      throw new NotFoundException('borrow request not found.');
    }

    const object = await this.borrowModel.findOne(borrow._id);

    if (object.status != 'pending') {
      await this.goldService.create({ client_id: object.sender, entry_by: "admin", remarks: "borrow approved, TrD:" + id, type: "debit", status: "success", coins: object.gold_coin, transaction_id: object.transaction_id, transaction_status: "borrowed" });

      await this.goldService.create({ client_id: object.receiver, entry_by: "admin", remarks: "borrow approved, TrD:" + id, type: "credit", status: "success", coins: object.gold_coin, transaction_id: object.transaction_id, transaction_status: "borrowed" });

      await this.silverService.create({ client_id: object.sender, entry_by: "admin", remarks: "borrow approved, TrD:" + id, type: "debit", status: "success", coins: object.silver_coin, transaction_id: object.transaction_id, transaction_status: "borrowed" });

      await this.silverService.create({ client_id: object.receiver, entry_by: "admin", remarks: "borrow approved, TrD:" + id, type: "credit", status: "success", coins: object.silver_coin, transaction_id: object.transaction_id, transaction_status: "borrowed" });

    }
    return this.userService.getUserRenewTokenForMobile(object.sender);
  }

  async remove(id: any) {
    const borrow = await this.borrowModel.findByIdAndDelete(id);

    if (!borrow) {
      throw new NotFoundException('borrow request not found.');
    }

    return { status: true, message: "borrow Delete successfully" };
  }

  async borrowReqeustBySender(user_id: any) {
    const borrowList = await this.borrowModel.find({ sender: user_id });
    return borrowList;
  }
  async borrowReqeustByReceive(user_id: any) {
    const borrowList = await this.borrowModel.find({ receiver: user_id });
    return borrowList;
  }
  async reverseBorrow(borrow_id: string) {
    const borrow = await this.borrowModel.findOne({ _id: borrow_id });

    if (borrow) {
      if (borrow.status == "pending") {
        return {
          status: false,
          message: "Request in pending"
        }
      }
      if (borrow.is_reverse) {
        return {
          status: false,
          message: "Request is already in reversed"
        }
      }
      await this.goldService.create({ client_id: borrow.sender, entry_by: "admin", remarks: "borrow request reverser", type: "credit", status: "success", coins: borrow.gold_coin, transaction_id: borrow.transaction_id, transaction_status: "borrowed" });

      await this.goldService.create({ client_id: borrow.receiver, entry_by: "admin", remarks: "borrow request reverser", type: "debit", status: "success", coins: borrow.gold_coin, transaction_id: borrow.transaction_id, transaction_status: "borrowed" });

      await this.silverService.create({ client_id: borrow.sender, entry_by: "admin", remarks: "borrow request reverser", type: "credit", status: "success", coins: borrow.silver_coin, transaction_id: borrow.transaction_id, transaction_status: "borrowed" });

      await this.silverService.create({ client_id: borrow.receiver, entry_by: "admin", remarks: "borrow request reverser", type: "debit", status: "success", coins: borrow.silver_coin ,transaction_id: borrow.transaction_id, transaction_status: "borrowed" });
      await this.borrowModel.findByIdAndUpdate(borrow_id, { is_reverse: true, status: 'reversed' });
      return {
        status: "success",
        message: "borrow request reverse progress",
      }
    } else {
      return {
        status: false,
        message: "Borrow request not found",
      }
    }

  }



}

