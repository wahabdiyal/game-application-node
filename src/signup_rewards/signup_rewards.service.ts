import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSignupRewardDto } from './dto/create-signup_reward.dto';
import { UpdateSignupRewardDto } from './dto/update-signup_reward.dto';
import { SignupReward } from './schemas/signup-rewards.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';

/////// signup reward history of gold and admin account and also all reward daily reward referral ////
@Injectable()
export class SignupRewardsService {
  constructor(
    @InjectModel(SignupReward.name)
    private signuprewardModel: mongoose.Model<SignupReward>,
  ) {}
  async create(@Body() createSignupRewardDto: CreateSignupRewardDto) {
    const collection = await this.signuprewardModel.find();
    const startinput = new Date(createSignupRewardDto['start_date']).getTime();
    const endinput = new Date(createSignupRewardDto['end_date']).getTime();
    const matchedCollection = [];
    for (const item of collection) {
      const startdb = new Date(item['start_date']).getTime();
      const enddb = new Date(item['end_date']).getTime();
      if (
        (startinput >= startdb && startinput <= enddb) ||
        (endinput >= startdb && endinput <= enddb) ||
        (startinput <= startdb && endinput >= startdb) ||
        (startinput <= enddb && endinput >= enddb)
      ) {
        matchedCollection.push(item);
      }
    }

    function checkRecordExists(records, criteria) {
      //         const [countries, startTime, endTime] = criteria;

      // for (const record of records) {
      //   if (record.country.some(ctry => countries.includes(ctry))) {
      //     const start = moment(record.start_date);
      //     const end = moment(record.end_date);
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

      const isInRange = function (date, start, end) {
        // a.push([{exp:date.isBetween(start, end ,undefined, '[')},{date: date, start: start, end: end}]);
        return date.isBetween(start, end, undefined, '[');
      };
      for (let x = 0; x < records.length; x++) {
        const record = records[x];
        // return record;
        for (let m = 0; m < record.country.length; m++) {
          const ctry = record.country[m];
          // return ctry;
          // for (let c = 0; c < cties.length; c++) {
          //   const ctry = cties[c];
          for (let usrcty = 0; usrcty < countries.length; usrcty++) {
            const element = countries[usrcty];
            if (element == ctry) {
              //  a.push({usrcty:[record.start_date,record.end_date,startTime,endTime]})
              // const start = moment(new Date(record.start_date));
              // const end = moment(new Date(record.end_date));

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

      //   const start = moment(new Date(record.start_date));
      //   const end = moment(new Date(record.end_date));
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

      //   // const dateMatches = record.start_date === startTime && record.end_date === endTime;
      //   return [record.start_date,startTime,record.end_date,endTime];
      //   const start = moment(record.start_date);
      //   const end = moment(record.end_date);
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

    const uniqueLowerCaseArray = [
      ...new Set(inputArray.map((item) => item.toLowerCase())),
    ];

    const searchCriteria = [
      uniqueLowerCaseArray,
      createSignupRewardDto['start_date'],
      createSignupRewardDto['end_date'],
    ];
    const val = checkRecordExists(matchedCollection, searchCriteria);
    //  return a;
    // return val;
    if (!val) {
      return await this.signuprewardModel.create({
        ...createSignupRewardDto,
        country: uniqueLowerCaseArray,
      });
    } else {
      return { status: false, message: 'Please select unique country' };
    }
  }

  async findAll(myRole = '', myCountries = '') {
    const query = {};
    if (myRole != 'Admin' && myRole != 'admin')
      query['country'] = {
        $in: myCountries
          .split(', ')
          .map((country) => country.trim().toLowerCase()),
      };
    return await this.signuprewardModel.find(query).sort({ createdAt: -1 });
  }

  async findOne(id: any) {
    return await this.signuprewardModel.findById(id);
  }

  async update(id: any, updateSignupRewardDto: UpdateSignupRewardDto) {
    const signupreward = await this.signuprewardModel.findByIdAndUpdate(
      id,
      updateSignupRewardDto,
    );

    if (!signupreward) {
      throw new NotFoundException('signupreward Coin not found.');
    }

    const data = await this.signuprewardModel.findById(id);

    return {
      status: true,
      data: data,
      message: 'signup reward updated successfully',
    };
  }

  async remove(id: any) {
    const signupreward = await this.signuprewardModel.findByIdAndDelete(id);

    if (!signupreward) {
      throw new NotFoundException('signup reward not found.');
    }

    return { status: true, message: 'signup reward Delete successfully' };
  }
  async getCoinByUserCountry(user_country: string) {
    return await this.signuprewardModel.findOne({
      country: { $in: [user_country] },
    });
  }
}
