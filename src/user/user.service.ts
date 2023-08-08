import { BadRequestException, Injectable, NotFoundException, Request } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import * as mongoose from 'mongoose';
import { retry } from 'rxjs';
 
 

@Injectable()
export class UserService {
constructor(
        @InjectModel(User.name)
        private userModel: mongoose.Model<User>,
      
        // private silverService: SilversService,
     
        ){}
        async findAll(page = 0, perPage = 20,){
          const totalCount = await this.userModel.countDocuments().exec();
          const totalPages = Math.ceil(totalCount / perPage);
      
          if (page < 1) {
            page = 1;
          } else if (page > totalPages) {
            page = totalPages;
          }
      
          const skip = (page - 1) * perPage;
          const data = await this.userModel.find().skip(skip).limit(perPage).exec();
          return {
            data:data,
            currentPage: page,
            totalPages,
            perPage,
            total_page:totalCount,
          };
          

            // const user = await this.userModel.find();
            // return user;
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

          async findwithUserRole(role: any)  {
          
            const user = await this.userModel.find({role:role});
        
            if (!user) {
              throw new NotFoundException('User not found.');
            }
    
            return user;
          }


          async getAllUser( ){
            return await this.userModel.find({ $or: [{ role: "Player" }, { role: "player" }] }).select([
              "full_name",
              "country",
          ]);
          }

          async findUserbyId(id: string): Promise<boolean> {
            try{
                 new mongoose.Types.ObjectId(id);
            }catch(e){
            return false;
            }
           
            const user = await this.userModel.exists({ _id: id});
            return user !== null;
            }
}
