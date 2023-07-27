import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import * as mongoose from 'mongoose';
import { SilversService } from 'src/silvers/silvers.service';
 

@Injectable()
export class UserService {
constructor(
        @InjectModel(User.name)
        private userModel: mongoose.Model<User>,
      
        // private silverService: SilversService,
     
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
        

          async findwithUserId(id: any)  {
          
            const user = await this.userModel.findById(id);
        
            if (!user) {
              throw new NotFoundException('User not found.');
            }
    
            return user;
          }

          getRelation(id: any){
              // const users =this.silverService.findUserValue(id) ;
              //   return users;
            }
}
