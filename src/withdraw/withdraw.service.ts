import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { UpdateWithdrawDto } from './dto/update-withdraw.dto';
import { Withdraw } from './schmas/withdraw.schema';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserService } from 'src/user/user.service';

@Injectable()
export class WithdrawService {
  constructor(
    @InjectModel(Withdraw.name)
    private withDrawModel: mongoose.Model<Withdraw>,
    private userModule: UserService,
  ){}

   async create(createWithdrawDto: CreateWithdrawDto): Promise<Withdraw>  {
    var res = await this.withDrawModel.create(createWithdrawDto);
     return res;
  }

  async findAll():Promise<Withdraw[]> {
    return await this.withDrawModel.find();
  }

  async findOne(id: any): Promise<Withdraw> {
    return await this.withDrawModel.findOne({_id : id});
  }

  async update(id: any, updateWithdrawDto: UpdateWithdrawDto) {
    const withdraw = await this.withDrawModel.findByIdAndUpdate(id,updateWithdrawDto);

    if (!withdraw) {
      throw new NotFoundException('Withdraw not found.');
    }

    return {status: true,message: "Withdraw updated successfully"};
  }

  async remove(id: any) {
    const withdraw = await this.withDrawModel.findByIdAndDelete(id);

    if (!withdraw) {
      throw new NotFoundException('Withdraw not found.');
    }

    return {status: true,message: "Withdraw Delete successfully"};
  }

  async userRequest(id: any){
    const withdraw = await this.withDrawModel.find({user_id: id});

    if (withdraw.length==0) {
      throw new NotFoundException('Withdraw not found.');
    }
    return {status: true,message: "Withdraw User Request","Requests":withdraw};
  }

}
