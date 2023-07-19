import { Injectable,NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import * as mongoose from 'mongoose';

@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name)
        private userModel: mongoose.Model<User>,
        ){}
        async findAll():Promise<User[]>{
            const user = await this.userModel.find();
            return user;
        }
        async create(user: User): Promise<User> {
            const res = await this.userModel.create(user);
            return res;
          }
          async findById(id: string): Promise<User> {
            const user = await this.userModel.findById(id);
        
            if (!user) {
              throw new NotFoundException('User not found.');
            }
        
            return user;
          }
}
