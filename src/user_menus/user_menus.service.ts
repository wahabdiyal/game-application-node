import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserMenuDto } from './dto/create-user_menu.dto';
import { UpdateUserMenuDto } from './dto/update-user_menu.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { UserMenu } from './schemas/user_menu.schema';

@Injectable()
export class UserMenusService {
  constructor(
    @InjectModel(UserMenu.name)
    private userMenuModel: mongoose.Model<UserMenu>
  ) { }
  async create(createUserMenuDto: CreateUserMenuDto) {
    await this.userMenuModel.deleteMany({ menu: createUserMenuDto['menu'].toString(), role: createUserMenuDto['role'].toString() })
    return await this.userMenuModel.create(createUserMenuDto);
  }

  async findAll() {
    return await this.userMenuModel.find();
  }

  async findOne(id: string) {
    return await this.userMenuModel.findById(id);
  }
  async findByRole(role: string) {
    return await this.userMenuModel.find({ role: role });
  }


  async update(id: any, body: UpdateUserMenuDto) {
    const userright = await this.userMenuModel.findByIdAndUpdate(id, body);

    if (!userright) {
      throw new NotFoundException('not found.');
    }

    return { status: true, message: "updated" };
  }

  async remove(id: any) {
    const userright = await this.userMenuModel.findByIdAndDelete(id);

    if (!userright) {
      throw new NotFoundException('not found.');
    }

    return { status: true, message: "removed" };
  }
}
