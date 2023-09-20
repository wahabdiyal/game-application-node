import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSignupRewardDto } from './dto/create-signup_reward.dto';
import { UpdateSignupRewardDto } from './dto/update-signup_reward.dto';
import { SignupReward } from './schemas/signup-rewards.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import * as moment from "moment";

@Injectable()
export class SignupRewardsService {
  constructor(
    @InjectModel(SignupReward.name)
    private signuprewardModel: mongoose.Model<SignupReward>,
  ){}
 async create(@Body() createSignupRewardDto: CreateSignupRewardDto) {
      const collection = await this.signuprewardModel.find({
        start_time: { $gte:new Date(createSignupRewardDto.start_time)},
         end_time: { $lte:new Date(createSignupRewardDto.end_time)},
      }).select(['country','start_time','end_time']);
    
      // const collection = await this.signuprewardModel.aggregate([{
      //   $match: {
      //     start_time: {
      //       $lte: createSignupRewardDto.start_time,   // Check if start_time is less than or equal to endDate
      //     },
      //     end_time: {
      //       $gte: createSignupRewardDto.end_time, // Check if end_time is greater than or equal to startDate
      //     },
      //   },
      // }]) ;
      //  let a=[];
      function checkRecordExists(records, criteria) {
        
//         const [countries, startTime, endTime] = criteria;

// for (const record of records) {
//   if (record.country.some(ctry => countries.includes(ctry))) {
//     const start = moment(record.start_time);
//     const end = moment(record.end_time);
//     const start2 = moment(startTime);
//     const end2 = moment(endTime);

//     const isInRange = (date, start, end) => date.isBetween(start, end, undefined, '[');
//     const dateMatches = isInRange(start2, start, end) && isInRange(end2, start, end);

//     if (dateMatches) {
//       return true;
//     }
//   }
// }

// return false;
      //this line of code current same above code is working
        const [countries, startTime, endTime] = criteria;
       
        const isInRange = function(date, start, end) {
          // a.push([{exp:date.isBetween(start, end ,undefined, '[')},{date: date, start: start, end: end}]);
          return date.isBetween(start, end ,undefined, '[');
        };
      for (let x = 0; x < records.length; x++){
        const record = records[x];
        // return record;
        for (let m = 0; m < record.country.length; m++) {
          const ctry = record.country[m];
          // return ctry;
          // for (let c = 0; c < cties.length; c++) {
          //   const ctry = cties[c];
            for (let usrcty = 0; usrcty <countries.length; usrcty++) {
              const element =countries[usrcty];
              if(element==ctry){
              //  a.push({usrcty:[record.start_time,record.end_time,startTime,endTime]})
                // const start = moment(new Date(record.start_time));
                // const end = moment(new Date(record.end_time));
                
                // const start2 = moment(new Date(startTime));
                // const end2 = moment(new Date(endTime));
        
                
                // const startdate =isInRange(start2,start,end);
              
                // const enddate =isInRange(end2,start,end);
        
                // const dateMatches = startdate && enddate;
                // if(dateMatches){
                  
                  return true;
                // }
                
              // }

              }
            }
            
          }
          
        }
        return false;

///////////////////this is not working well///////////////////////
      //   const countryMatches = countries.every(country => record.country.includes(country));
      //   // return countryMatches;
      //   if(countryMatches) {
        
         
      //   const start = moment(new Date(record.start_time));
      //   const end = moment(new Date(record.end_time));
      //   const start2 = moment(new Date(startTime));
      //   const end2 = moment(new Date(endTime));

      //   const isInRange = function(date, start, end) {
      //     return date.isBetween(start, end ,undefined, '[');
      //   };
      //   const startdate =isInRange(start2,start,end);
      
      //   const enddate =isInRange(end2,start,end);

      //   const dateMatches = startdate && enddate;
      //   if(dateMatches){
         
      //       a.push(true);
      //   }
      //      }
      // }
      
      //  return a 
        // return records.some(record => {
        //   const countryMatches = countries.every(country => record.country.includes(country));
         
        //   // const dateMatches = record.start_time === startTime && record.end_time === endTime;
        //   return [record.start_time,startTime,record.end_time,endTime];
        //   const start = moment(record.start_time);
        //   const end = moment(record.end_time);
        //   const start2 = moment(startTime);
        //   const end2 = moment(endTime);

        //   const isInRange = function(date, start, end) {
        //     return date.isBetween(start, end);
        //   };
        //   const startdate  =isInRange(start2,start,end);
        //   const enddate  =isInRange(end2,start,end);
        //   const dateMatches = startdate && enddate;
        //   return dateMatches;
        //   return countryMatches && dateMatches;
        // });
      }
     
      const inputArray = createSignupRewardDto['country'];
 
      const uniqueLowerCaseArray = [...new Set(inputArray.map(item => item.toLowerCase()))];
      
      const searchCriteria = [uniqueLowerCaseArray,createSignupRewardDto.start_time,createSignupRewardDto.end_time];
      const val  = checkRecordExists(collection,searchCriteria);
        //  return a;
          // return val;
    if(!val){
          
      
       return await this.signuprewardModel.create({ ...createSignupRewardDto,country:uniqueLowerCaseArray } );
    }else{
      return {"status": false,"message": "Please select unique country"}
    }
      

   
  }

 async findAll() {
    return await this.signuprewardModel.find() ;
  }

 async findOne(id: any) {
    return await this.signuprewardModel.findById(id);
  }

 async update(id: any, updateSignupRewardDto: UpdateSignupRewardDto) {
    const signupreward = await this.signuprewardModel.findByIdAndUpdate(id,updateSignupRewardDto);

    if (!signupreward) {
      throw new NotFoundException('signupreward Coin not found.');
    }
  
    return {status: true,message: "signup reward updated successfully"};
  }

 async remove(id: any) {
    const signupreward = await this.signuprewardModel.findByIdAndDelete(id);

    if (!signupreward) {
      throw new NotFoundException('signup reward not found.');
    }

    return {status: true,message: "signup reward Delete successfully"};
  }
  async getCoinByUserCountry( user_country:string ){
    return await this.signuprewardModel.findOne({
      country: { $in: [user_country] }
  });
  }
}
