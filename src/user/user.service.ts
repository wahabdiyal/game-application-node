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
          async findById(email: string): Promise<User> {
           
            const user = await this.userModel.findOne({email: email});
        
            if (!user) {
              throw new NotFoundException('User not found.');
            }
    
            return user;
          }

          async update(id: any, body:any) {
            const user = await this.userModel.findByIdAndUpdate(id,body);
        
            if (!user) {
              throw new NotFoundException('User not found.');
            }
    
            return {status: true,message: "User updated successfully"};
          }

         async remove(id: any)   {
            const userdel = await this.userModel.findOneAndDelete(id);
            console.log(userdel,id);
             return userdel;
          }
          async findwithUserId(id: any): Promise<User> {
           
            const user = await this.userModel.findOne(id);
        
            if (!user) {
              throw new NotFoundException('User not found.');
            }
    
            return user;
          }
}
