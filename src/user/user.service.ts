import { error } from 'console';
import { BadRequestException, Injectable, NotFoundException, Request } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import * as mongoose from 'mongoose';
import { SignupRewardsService } from 'src/signup_rewards/signup_rewards.service';
import { ReferralCodesService } from 'src/referral_codes/referral_codes.service';
import { ReferralRewardsService } from 'src/referral_rewards/referral_rewards.service';
import * as moment from "moment";
 
 

@Injectable()
export class UserService {
constructor(
        @InjectModel(User.name)
        private userModel: mongoose.Model<User>,
        private signuprewardService:SignupRewardsService,
        private refcodeService:ReferralCodesService,
         private refrewardService:ReferralRewardsService,
        ){}
        /*
        date for start and end date

         async searchByDateRange(startDate: Date, endDate: Date): Promise<User[]> {
    const users = await this.userModel.find({
      created_at: { $gte: startDate, $lte: endDate },
    }).exec();
    return users;
         }*/
        async findAll(page = 0, perPage = 20,search=false,date = [],role=false){
        let totalCount =0
        if(search && date.length >0 && role){
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
            ],
             createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
             role:role,
          }).countDocuments().exec();
        }else if (date.length >0 && role){
          const parsedStartDate = new Date(date[0].start);
            const parsedEndDate = new Date(date[0].end);
          
            totalCount =  await this.userModel.find({
              createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
              role: role
            }).countDocuments().exec();
        }else if (search && role){
          totalCount  = await this.userModel.find({
            $or: [
              { full_name: { $regex: search, $options: 'i' } }, // Case-insensitive search
              { country: { $regex: search, $options: 'i' } }, // Case-insensitive search
              { email: { $regex: search, $options: 'i' } }, // Case-insensitive search
              { gold_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
              { silver_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
              { role: { $regex: search, $options: 'i' } }, // Case-insensitive search
              // Add more fields here
            ],role:role,
          }).countDocuments().exec();
        }else if(search && date.length >0){
           
          let parsedStartDate = new Date(date[0].start);
          let parsedEndDate = new Date(date[0].end);
          totalCount  = await this.userModel.find({
              $or: [
                { full_name: { $regex: search, $options: 'i' } }, // Case-insensitive search
                { country: { $regex: search, $options: 'i' } }, // Case-insensitive search
                { email: { $regex: search, $options: 'i' } }, // Case-insensitive search
                { gold_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
                { silver_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
                 
              ], createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
            }).countDocuments().exec();
          }else if(role){
             
            totalCount =  await this.userModel.find({
              role:role,
            }).countDocuments().exec();
          }
          else if(search){
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
          try{ 
          if(search && date.length >0 && role){
            let parsedStartDate = new Date(date[0].start);
            let parsedEndDate = new Date(date[0].end);
            data = await this.userModel.find({
              $or: [
                { full_name: { $regex: search, $options: 'i' } }, // Case-insensitive search
                { country: { $regex: search, $options: 'i' } }, // Case-insensitive search
                { email: { $regex: search, $options: 'i' } }, // Case-insensitive search
                { gold_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
                { silver_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
              ],
              createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
              role:role,
            }).skip(skip).limit(perPage).exec();
          }else if(search && date.length >0){
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
          }else if(search && role){
            data = await this.userModel.find({
              $or: [
                { full_name: { $regex: search, $options: 'i' } }, // Case-insensitive search
                { country: { $regex: search, $options: 'i' } }, // Case-insensitive search
                { email: { $regex: search, $options: 'i' } }, // Case-insensitive search
                { gold_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
                { silver_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
                { role: { $regex: search, $options: 'i' } }, // Case-insensitive search
                // Add more fields here
              ],role:role
            }).skip(skip).limit(perPage).exec();

          }else if(date.length > 0 && role){
            const parsedStartDate = new Date(date[0].start);
            const parsedEndDate = new Date(date[0].end);
            data = await this.userModel.find({
              createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
              role:role,
            }).skip(skip).limit(perPage).exec();

          }else if(search){
            data = await this.userModel.find({
              $or: [
                { full_name: { $regex: search, $options: 'i' } }, // Case-insensitive search
                { country: { $regex: search, $options: 'i' } }, // Case-insensitive search
                { email: { $regex: search, $options: 'i' } }, // Case-insensitive search
                { gold_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
                { silver_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
                 
                // Add more fields here
              ],
            }).skip(skip).limit(perPage).exec();

          }else if(date.length > 0){
            const parsedStartDate = new Date(date[0].start);
            const parsedEndDate = new Date(date[0].end);
            data = await this.userModel.find({
              createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
            }).skip(skip).limit(perPage).exec();

          }else if(role){
           
            data = await this.userModel.find({
              role:role,
            }).skip(skip).limit(perPage).exec();

          }else{
            data = await this.userModel.find().skip(skip).limit(perPage).exec();
          }
        }catch(error){
          data = [];
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
        async create( user: any): Promise<any> {
         


          let usercheck = await this.userModel.find().where('email', user.email).exec();
           
          if(!usercheck.length){  
            let getCoinValue = await this.signuprewardService.getCoinByUserCountry(user.country);
              if(user.refereal_code){
                const getRefDetail = await this.refcodeService.getRefWithCode(user.refereal_code);
                //  return getRefDetail;
                const userRef = await this.findwithUserId(getRefDetail.user_id);
              //  return userRef;
                const refRewardSetting = await this.refrewardService.getRefRewardByDate();
               if(refRewardSetting && getRefDetail && userRef){
               const daycount  = moment(this.getDate()).diff(moment(this.getDate(getRefDetail.use_date)), 'days')+1;
                
             
                 if(Number(refRewardSetting.days_limit) >= daycount && Number(getRefDetail.total_use) < Number(refRewardSetting.referral_limit)){
                //////////////////////////////////////////// user gold transaction and silver transaction
                  /////////////////user  coin and referral code update total_uss
                  return true;

                }

               }
                ////////////////////when error fix then here code for update user coin who ref code found accouding to refreward/
              }
              return false;
            ///////// debit in admin account 
              return  this.userModel.create({...user,silver_balance:getCoinValue.silver_coin,
                gold_balance:getCoinValue.gold_coin
            });
             
              
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

            getDate(value=null){
              const date = new Date(value);
              const day = date.getDate();
              const month = date.getMonth() + 1; // Months are zero-indexed in JavaScript
              const year = date.getFullYear();
              console.log(new Date(`${year}-${month}-${day}`));
              return new Date(`${year}-${month}-${day}`);
            }
          
}
