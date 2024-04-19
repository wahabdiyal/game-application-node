import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBorrowStatusDto } from './dto/create-borrow_status.dto';
import { UpdateBorrowStatusDto } from './dto/update-borrow_status.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { BorrowStatus } from './schemas/borrow_status.schema';

@Injectable()
export class BorrowStatusService {
  constructor(
    @InjectModel(BorrowStatus.name)
    private borrowStatusModel: mongoose.Model<BorrowStatus>,
  ) {}
  async create(createBorrowStatusDto: CreateBorrowStatusDto) {
    var res = await this.borrowStatusModel.create(createBorrowStatusDto);
    return res;
  }
  async findLastTransaction() {
    return await this.borrowStatusModel
      .findOne()
      .sort({ createdAt: -1 }) // Replace "timestampField" with the actual field you want to sort by
      .limit(1)
      .exec();
  }

  async findAll() {
    return await this.borrowStatusModel.find();
  }

  async findOne(id: any) {
    return await this.borrowStatusModel.findOne();
  }

  async update(id: any, updateborrowDto: UpdateBorrowStatusDto) {
    const borrow = await this.borrowStatusModel.findByIdAndUpdate(
      id,
      updateborrowDto,
    );

    if (!borrow) {
      throw new NotFoundException('borrow request not found.');
    }

    const object = await this.borrowStatusModel.findOne(borrow._id);

    return {
      status: true,
      data: object,
      message: 'borrow request updated successfully',
    };
  }

  async remove(id: any) {
    const borrow = await this.borrowStatusModel.findByIdAndDelete(id);

    if (!borrow) {
      throw new NotFoundException('borrow request not found.');
    }

    return { status: true, message: 'borrow Delete successfully' };
  }
}
