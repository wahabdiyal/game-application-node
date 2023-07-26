import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import * as mongoose from 'mongoose';

@Injectable()
export class UserService {

<<<<<<< HEAD
  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
  ) { }
  async findAll(): Promise<User[]> {
    const user = await this.userModel.find();
    return user;
  }
  async create(user: User): Promise<User> {
    return await this.userModel.create(user);
    if (!user) {
      const res = await this.userModel.create(user);
      return res;
    }
    throw new BadRequestException('User already exists');
  }
  async findById(email: string): Promise<User> {

    const user = await this.userModel.findOne({ email: email });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  async update(id: any, body: any) {
    const user = await this.userModel.findByIdAndUpdate(id, body);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return { status: true, message: "User updated successfully" };
  }

  async remove(id: any) {
    const userdel = await this.userModel.findOneAndDelete(id);

    return userdel;
  }
  async findwithUserId(id: any): Promise<User> {

    const user = await this.userModel.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }
=======
    constructor(
        @InjectModel(User.name)
        private userModel: mongoose.Model<User>,
        ){}
        async findAll():Promise<User[]>{
            const user = await this.userModel.find();
            return user;
        }
        async create(user: User): Promise<User> {
       
          let usercheck = await this.userModel.find().where('email', user.email).exec();
           
          if(!usercheck.length){
             const res = await this.userModel.create(user);
            return res;
          }
           throw new BadRequestException('User already exists');
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

          async remove(id: any) {
            const user = await this.userModel.findByIdAndDelete(id);
        
            if (!user) {
              throw new NotFoundException('User not found.');
            }
        
            return {status: true,message: "User Delete successfully"};
          }
        

          async findwithUserId(id: any): Promise<User> {
           
            const user = await this.userModel.findOne(id);
        
            if (!user) {
              throw new NotFoundException('User not found.');
            }
    
            return user;
          }
>>>>>>> a1186ff4f1d2928ffbaefd6a0060346838dafd0f
}
