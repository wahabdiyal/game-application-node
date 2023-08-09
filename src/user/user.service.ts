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
        /*
        date for start and end date

         async searchByDateRange(startDate: Date, endDate: Date): Promise<User[]> {
    const users = await this.userModel.find({
      created_at: { $gte: startDate, $lte: endDate },
    }).exec();
    return users;
         }*/
        async findAll(page = 0, perPage = 20,search=false,date = []){
        let totalCount =0
          if(search && date.length >0){
            let parsedStartDate = new Date(date[0].start);
            let parsedEndDate = new Date(date[0].end);
            totalCount  = await this.userModel.find({
              $or: [
                { full_name: { $regex: search, $options: 'i' } }, // Case-insensitive search
                { country: { $regex: search, $options: 'i' } }, // Case-insensitive search
                { email: { $regex: search, $options: 'i' } }, // Case-insensitive search
                { gold_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
                { silver_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
                
                // Add more fields here
              ], createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
            }).countDocuments().exec();
          }else if(search){
            totalCount  = await this.userModel.find({
              $or: [
                { full_name: { $regex: search, $options: 'i' } }, // Case-insensitive search
                { country: { $regex: search, $options: 'i' } }, // Case-insensitive search
                { email: { $regex: search, $options: 'i' } }, // Case-insensitive search
                { gold_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
                { silver_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
                { role: { $regex: search, $options: 'i' } }, // Case-insensitive search
                // Add more fields here
              ],
            }).countDocuments().exec();
          }else if(date.length > 0){
           
            const parsedStartDate = new Date(date[0].start);
            const parsedEndDate = new Date(date[0].end);
          
            totalCount =  await this.userModel.find({
              createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
            }).countDocuments().exec();
          }else{
            totalCount = await this.userModel.countDocuments().exec();
          }
           
          const totalPages = Math.ceil(totalCount / perPage);
      
          if (page < 1) {
            page = 1;
          } else if (page > totalPages) {
            page = totalPages;
          }
      
          const skip = (page - 1) * perPage;
          let data=[];
          if(search && date.length >0){
            let parsedStartDate = new Date(date[0].start);
            let parsedEndDate = new Date(date[0].end);
            data = await this.userModel.find({
              $or: [
                { full_name: { $regex: search, $options: 'i' } }, // Case-insensitive search
                { country: { $regex: search, $options: 'i' } }, // Case-insensitive search
                { email: { $regex: search, $options: 'i' } }, // Case-insensitive search
                { gold_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
                { silver_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
                { role: { $regex: search, $options: 'i' } }, // Case-insensitive search
                // Add more fields here
              ], createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
            }).skip(skip).limit(perPage).exec();
          }else if(search){
            data = await this.userModel.find({
              $or: [
                { full_name: { $regex: search, $options: 'i' } }, // Case-insensitive search
                { country: { $regex: search, $options: 'i' } }, // Case-insensitive search
                { email: { $regex: search, $options: 'i' } }, // Case-insensitive search
                { gold_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
                { silver_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
                { role: { $regex: search, $options: 'i' } }, // Case-insensitive search
                // Add more fields here
              ],
            }).skip(skip).limit(perPage).exec();

          }else if(date.length > 0){
            const parsedStartDate = new Date(date[0].start);
            const parsedEndDate = new Date(date[0].end);
            data = await this.userModel.find({
              createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
            }).skip(skip).limit(perPage).exec();

          }else{
            data = await this.userModel.find().skip(skip).limit(perPage).exec();
          }
         
          return {
            data:data,
            currentPage: page,
            totalPages,
            perPage,
            total_count:totalCount,
          };
          

            // const user = await this.userModel.find();
            // return user;
        }
        async create(user: User): Promise<User> {
       
          let usercheck = await this.userModel.find().where('email', user.email).exec();
           
          if(!usercheck.length){
             const res = new this.userModel(user);
             return res.save();
             
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

          async findUserbyId(id: string)  {
            try{
                 new mongoose.Types.ObjectId(id);
            }catch(e){
            return false;
            }
           
            const user = await this.userModel.findOne({ _id: id});
            return user ;
            }

            async UpdateUser(user_id , data,type){
              if(type =="silver"){
                 return await this.userModel.updateOne({_id:user_id},{silver_balance:data});
              }else{
                return await this.userModel.updateOne({_id:user_id},{gold_balance:data});
              }
             
            }
          
}
