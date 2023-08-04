import { UserRight } from './schemas/user_right.schema';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserRightDto } from './dto/create-user_right.dto';
import { UpdateUserRightDto } from './dto/update-user_right.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Injectable()
export class UserRightService {
  constructor(
 @InjectModel(UserRight.name)
  private userRigthModel: mongoose.Model<UserRight>,

  ){}
 
  async create(createUserRightDto: CreateUserRightDto) {
            await this.userRigthModel.deleteMany({});
            
     return await this.userRigthModel.create(createUserRightDto);
  }

  async findAll() {
    return  await this.userRigthModel.find();
  }

  async findOne(id: string) {
    return await this.userRigthModel.findById(id);
  }

  async update(id: any, body:UpdateUserRightDto) {
    const userright = await this.userRigthModel.findByIdAndUpdate(id,body);
  
    if (!userright) {
      throw new NotFoundException('User-right not found.');
    }
  
    return {status: true,message: "User-right updated successfully"};
  }

  async remove(id: any) {
    const userright = await this.userRigthModel.findByIdAndDelete(id);

    if (!userright) {
      throw new NotFoundException('user-right  not found.');
    }

    return {status: true,message: "user-right Delete successfully"};
  }
}
