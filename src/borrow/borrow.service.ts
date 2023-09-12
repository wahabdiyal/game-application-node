import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { UpdateBorrowDto } from './dto/update-borrow.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Borrow } from './schemas/borrow.schema';
import mongoose from 'mongoose';
import { SilversService } from 'src/silvers/silvers.service';
import { GoldsService } from 'src/golds/golds.service';
import { UserService } from 'src/user/user.service';
 
@Injectable()
export class BorrowService {
  constructor(
    @InjectModel(Borrow.name)
    private borrowModel: mongoose.Model<Borrow>,
    private silverService:SilversService,
    private goldService:GoldsService,
    private userService:UserService
  ) { }

  async create(createborrowDto: CreateBorrowDto) {

    if(createborrowDto['status']!='pending'){
    await this.goldService.create({client_id:createborrowDto['sender'],entry_by:"admin",remarks:"borrow reqeust",type:"debit",status:"success",coins:createborrowDto['gold_coin']});

    await this.goldService.create({client_id:createborrowDto['receiver'],entry_by:"admin",remarks:"borrow reqeust",type:"credit",status:"success",coins:createborrowDto['gold_coin']});

    await this.silverService.create({client_id:createborrowDto['sender'],entry_by:"admin",remarks:"borrow reqeust",type:"debit",status:"success",coins:createborrowDto['silver_coin']});

    await this.silverService.create({client_id:createborrowDto['receiver'],entry_by:"admin",remarks:"borrow reqeust",type:"credit",status:"success",coins:createborrowDto["silver_coin"]});

    }
    var res = await this.borrowModel.create(createborrowDto);
    return res;
  }

  async findAll() {
    return await this.borrowModel.find();
  }

  async findOne(id: any) {
    return await this.borrowModel.findOne({ _id: id });
  }

  async update(id: any, updateborrowDto: UpdateBorrowDto) {
    const borrow = await this.borrowModel.findByIdAndUpdate(id, updateborrowDto);

   
    if (!borrow) {
      throw new NotFoundException('borrow request not found.');
    }

    const object = await this.borrowModel.findOne(borrow._id);
  
    if(object.status!='pending'){
    
    const a =   await this.goldService.create({client_id:object.sender,entry_by:"admin",remarks:"borrow reqeust",type:"debit",status:"success",coins:object.gold_coin});
  
      await this.goldService.create({client_id:object.receiver,entry_by:"admin",remarks:"borrow reqeust",type:"credit",status:"success",coins:object.gold_coin});
  
      await this.silverService.create({client_id:object.sender,entry_by:"admin",remarks:"borrow reqeust",type:"debit",status:"success",coins:object.silver_coin});
  
      await this.silverService.create({client_id:object.receiver,entry_by:"admin",remarks:"borrow reqeust",type:"credit",status:"success",coins:object.silver_coin});
  
      }
    return { status: true, data: object, message: "borrow request updated successfully" };
  }

  async remove(id: any) {
    const borrow = await this.borrowModel.findByIdAndDelete(id);

    if (!borrow) {
      throw new NotFoundException('borrow request not found.');
    }

    return { status: true, message: "borrow Delete successfully" };
  }

  async getborrowList(list: any) {
    const borrowList = await this.borrowModel.find({ _id: list });
    return borrowList;
  }
  async reverseBorrow(borrow_id: string){
    const borrow = await this.borrowModel.findOne({ _id: borrow_id });
    //// borrow collection need some param for manage that return or not request by admin///////////
    if(borrow ){
        if(borrow.status=="pending"){
          return {
            status:"error",
            message:"Request in pending"
          }
        }
          await this.goldService.create({client_id:borrow.sender,entry_by:"admin",remarks:"borrow reqeust reverser",type:"credit",status:"success",coins:borrow.gold_coin});

          await this.goldService.create({client_id:borrow.receiver,entry_by:"admin",remarks:"borrow reqeust reverser",type:"debit",status:"success",coins:borrow.gold_coin});

          await this.silverService.create({client_id:borrow.sender,entry_by:"admin",remarks:"borrow reqeust reverser",type:"credit",status:"success",coins:borrow.silver_coin});

          await this.silverService.create({client_id:borrow.receiver,entry_by:"admin",remarks:"borrow reqeust reverser",type:"debit",status:"success",coins:borrow.silver_coin});
          return {
            status: "success",
            message : "borrow reqeust reverse progress",
          }
    }else{
      return {
        status: "error",
        message:"Borrow request not found",
      }
    }

  }
}
 
  