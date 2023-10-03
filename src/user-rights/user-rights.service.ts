import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserRightDto } from './dto/create-user-right.dto';
import { UpdateUserRightDto } from './dto/update-user-right.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { UserRights } from './schemas/user-rights.schema';

@Injectable()
export class UserRightsService {
  constructor(
    @InjectModel(UserRights.name)
    private userRightsModel: mongoose.Model<UserRights>
  ) { }
  async create(createUserRightDto: CreateUserRightDto) {
    await this.userRightsModel.deleteMany(
      {
        link: createUserRightDto['link'].toString(),
        controller: createUserRightDto['controller'].toString(),
        role: createUserRightDto['role'].toString(),
      })
    return await this.userRightsModel.create(createUserRightDto);
  }

  async findAll() {
    return await this.userRightsModel.find();
  }

  async findOne(id: string) {
    return await this.userRightsModel.findById(id);
  }
  async findByRole(role: string) {
    return await this.userRightsModel.find({ role: role });
  }


  async update(id: any, body: UpdateUserRightDto) {
    const userright = await this.userRightsModel.findByIdAndUpdate(id, body);

    if (!userright) {
      throw new NotFoundException('not found.');
    }

    return { status: true, message: "updated" };
  }

  async remove(id: any) {
    const userright = await this.userRightsModel.findByIdAndDelete(id);

    if (!userright) {
      throw new NotFoundException('not found.');
    }

    return { status: true, message: "removed" };
  }
}
