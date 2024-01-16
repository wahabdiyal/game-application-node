import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, Injectable, NotFoundException, Request } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import * as mongoose from 'mongoose';
import { SignupRewardsService } from 'src/signup_rewards/signup_rewards.service';
import { ReferralCodesService } from 'src/referral_codes/referral_codes.service';
import { ReferralRewardsService } from 'src/referral_rewards/referral_rewards.service';
import * as moment from "moment";
import { CoinTrasService } from 'src/coin_tras/coin_tras.service';
import axios, { AxiosInstance } from 'axios';
import { NotificationService } from 'src/gerenal-notification/notification.service';
import * as fs from 'fs';


@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
    private signuprewardService: SignupRewardsService,
    private refcodeService: ReferralCodesService,
    private refrewardService: ReferralRewardsService,
    // private coinTraService: CoinTrasService,
    private jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly notificationService: NotificationService
    

  ) { }
  async sendNotificationToUser(userId: string, message: string,title:string) {
    const user = await this.findByUserId(userId);
     
    const payload = {
      title:title,
      body: message,
    };
    try{
       await this.notificationService.sendNotification(user.deviceToken, payload);
       return {status:true,message:'Notification sent.'};
    }catch (error) {
      return {status:false,message:error};
    }
   
  }

  async findAllForOperator(page = 0, perPage = 20, search = false, date = [], role = false, country) {
    let totalCount = 0
    if (search && date.length > 0 && role) {
      let parsedStartDate = new Date(date[0].start);
      let parsedEndDate = new Date(date[0].end);
      totalCount = await this.userModel.find({
        $or: [
          { userId: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { first_name: { $regex: search, $options: 'i' } },
          { last_name: { $regex: search, $options: 'i' } }, // Case-insensitive search

          { email: { $regex: search, $options: 'i' } }, // Case-insensitive search
          { gold_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
          { silver_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search

          // Add more fields here
        ],
        country: { $in: country.replace(" ", "").split(",") }, role: "player",
        createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },

      }).countDocuments().exec();
    } else if (date.length > 0 && role) {
      const parsedStartDate = new Date(date[0].start);
      const parsedEndDate = new Date(date[0].end);

      totalCount = await this.userModel.find({
        country: { $in: country.replace(" ", "").split(",") }, role: "player",
        createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },

      }).countDocuments().exec();
    } else if (search && role) {
      totalCount = await this.userModel.find({
        $or: [
          { userId: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { first_name: { $regex: search, $options: 'i' } },
          { last_name: { $regex: search, $options: 'i' } }, // Case-insensitive search

          { email: { $regex: search, $options: 'i' } }, // Case-insensitive search
          { gold_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
          { silver_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
          // Add more fields here
        ], country: { $in: country.replace(" ", "").split(",") }, role: "player",
      }).countDocuments().exec();
    } else if (search && date.length > 0) {

      let parsedStartDate = new Date(date[0].start);
      let parsedEndDate = new Date(date[0].end);
      totalCount = await this.userModel.find({
        $or: [
          { userId: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { first_name: { $regex: search, $options: 'i' } },
          { last_name: { $regex: search, $options: 'i' } }, // Case-insensitive search

          { email: { $regex: search, $options: 'i' } }, // Case-insensitive search
          { gold_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
          { silver_balance: { $regex: search, $options: 'i' } },  // Case-insensitive search

        ], createdAt: { $gte: parsedStartDate, $lte: parsedEndDate }, country: { $in: country.replace(" ", "").split(",") }, role: "player",
      }).countDocuments().exec();
    } else if (role) {

      totalCount = await this.userModel.find({

        country: { $in: country.replace(" ", "").split(",") }, role: "player",
      }).countDocuments().exec();
    } else if (search) {
      totalCount = await this.userModel.find({
        $or: [
          { userId: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { first_name: { $regex: search, $options: 'i' } },
          { last_name: { $regex: search, $options: 'i' } }, // Case-insensitive search

          { email: { $regex: search, $options: 'i' } }, // Case-insensitive search
          { gold_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
          { silver_balance: { $regex: search, $options: 'i' } },  // Case-insensitive search
          // Add more fields here
        ], country: { $in: country.replace(" ", "").split(",") }, role: "player",
      }).countDocuments().exec();
    } else if (date.length > 0) {

      const parsedStartDate = new Date(date[0].start);
      const parsedEndDate = new Date(date[0].end);

      totalCount = await this.userModel.find({
        createdAt: { $gte: parsedStartDate, $lte: parsedEndDate }, country: { $in: country.replace(" ", "").split(",") }, role: "player",
      }).countDocuments().exec();
    } else {
      totalCount = await this.userModel.find({
        country: { $in: country.replace(" ", "").split(",") }, role: "player",
      }).countDocuments().exec();
    }

    const totalPages = Math.ceil(totalCount / perPage);

    if (page < 1) {
      page = 1;
    } else if (page > totalPages) {
      page = totalPages;
    }

    const skip = (page - 1) * perPage;
    let data = [];
    try {
      if (search && date.length > 0 && role) {
        let parsedStartDate = new Date(date[0].start);
        let parsedEndDate = new Date(date[0].end);
        data = await this.userModel.find({
          $or: [
            { userId: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } },
            { first_name: { $regex: search, $options: 'i' } },
            { last_name: { $regex: search, $options: 'i' } }, // Case-insensitive search

            { email: { $regex: search, $options: 'i' } }, // Case-insensitive search
            { gold_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
            { silver_balance: { $regex: search, $options: 'i' } },  // Case-insensitive search
          ],
          createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
          country: { $in: country.replace(" ", "").split(",") }, role: "player",

        }).sort({ createdAt: -1 }).skip(skip).limit(perPage).exec();
      } else if (search && date.length > 0) {
        let parsedStartDate = new Date(date[0].start);
        let parsedEndDate = new Date(date[0].end);
        data = await this.userModel.find({
          $or: [
            { userId: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } },
            { first_name: { $regex: search, $options: 'i' } },
            { last_name: { $regex: search, $options: 'i' } }, // Case-insensitive search

            { email: { $regex: search, $options: 'i' } }, // Case-insensitive search
            { gold_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
            { silver_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
            // Add more fields here
          ],
          createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
          country: { $in: country.replace(" ", "").split(",") }, role: "player",
        }).sort({ createdAt: -1 }).skip(skip).limit(perPage).exec();
      } else if (search && role) {
        data = await this.userModel.find({
          $or: [
            { userId: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } },
            { first_name: { $regex: search, $options: 'i' } },
            { last_name: { $regex: search, $options: 'i' } }, // Case-insensitive search

            { email: { $regex: search, $options: 'i' } }, // Case-insensitive search
            { gold_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
            { silver_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
            // Add more fields here
          ],
          country: { $in: country.replace(" ", "").split(",") }, role: "player",
        }).sort({ createdAt: -1 }).skip(skip).limit(perPage).exec();

      } else if (date.length > 0 && role) {
        const parsedStartDate = new Date(date[0].start);
        const parsedEndDate = new Date(date[0].end);
        data = await this.userModel.find({
          createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
          country: { $in: country.replace(" ", "").split(",") }, role: "player",
        }).sort({ createdAt: -1 }).skip(skip).limit(perPage).exec();

      } else if (search) {
        data = await this.userModel.find({
          $or: [
            { userId: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } },
            { first_name: { $regex: search, $options: 'i' } },
            { last_name: { $regex: search, $options: 'i' } },

            { email: { $regex: search, $options: 'i' } },
            { gold_balance: { $regex: search, $options: 'i' } },
            { silver_balance: { $regex: search, $options: 'i' } },

          ], country: { $in: country.replace(" ", "").split(",") }, role: "player",
        }).sort({ createdAt: -1 }).skip(skip).limit(perPage).exec();

      } else if (date.length > 0) {
        const parsedStartDate = new Date(date[0].start);
        const parsedEndDate = new Date(date[0].end);
        data = await this.userModel.find({
          createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
          country: { $in: country.replace(" ", "").split(",") }, role: "player",
        }).sort({ createdAt: -1 }).skip(skip).limit(perPage).exec();

      } else if (role) {

        data = await this.userModel.find({

          country: { $in: country.replace(" ", "").split(",") }, role: "player",
        }).sort({ createdAt: -1 }).skip(skip).limit(perPage).exec();

      } else {
        data = await this.userModel.find({
          country: { $in: country.replace(" ", "").split(",") }, role: "player",
        }).sort({ createdAt: -1 }).skip(skip).limit(perPage).exec();
      }
    } catch (error) {
      data = [];
    }

    return {
      data: data,
      currentPage: page,
      totalPages,
      perPage,
      total_count: totalCount,
    };

  }

  async findAll(page = 0, perPage = 20, search = false, date = [], role = false, myRole = "", myCountries = "") {
    let totalCount = 0
    const query = {};
    if (myRole != "Admin" && myRole != "admin")
      query['country'] = { $in: myCountries.split(", ") };
    if (date.length > 0) {
      let parsedStartDate = new Date(date[0].start);
      let parsedEndDate = new Date(date[0].end);
      query['createdAt'] = { $gte: parsedStartDate, $lte: parsedEndDate };
    }
    if (search) {
      if (myRole != "Admin" && myRole != "admin")
        query['$or'] = [
          { userId: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { first_name: { $regex: search, $options: 'i' } },
          { last_name: { $regex: search, $options: 'i' } }, // Case-insensitive search
          // { country: { $regex: search, $options: 'i' } }, // Case-insensitive search
          { email: { $regex: search, $options: 'i' } }, // Case-insensitive search
          { gold_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
          { silver_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
        ];
      else
        query['$or'] = [
          { userId: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { first_name: { $regex: search, $options: 'i' } },
          { last_name: { $regex: search, $options: 'i' } }, // Case-insensitive search
          { country: { $regex: search, $options: 'i' } }, // Case-insensitive search
          { email: { $regex: search, $options: 'i' } }, // Case-insensitive search
          { gold_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
          { silver_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
        ];
    }

    if (role)
      query['role'] = role;


    totalCount = await this.userModel.find(query).countDocuments().exec();
    const totalPages = Math.ceil(totalCount / perPage);

    // if (search && date.length > 0 && role) {

    //   totalCount = await this.userModel.find({
    //     $or: [
    //       { userId: { $regex: search, $options: 'i' } },
    //       { phone: { $regex: search, $options: 'i' } },
    //       { first_name: { $regex: search, $options: 'i' } },
    //       { last_name: { $regex: search, $options: 'i' } }, // Case-insensitive search
    //       { country: { $regex: search, $options: 'i' } }, // Case-insensitive search
    //       { email: { $regex: search, $options: 'i' } }, // Case-insensitive search
    //       { gold_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
    //       { silver_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search

    //       // Add more fields here
    //     ],
    //     createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
    //     role: role,
    //   }).countDocuments().exec();
    // } else if (date.length > 0 && role) {
    //   const parsedStartDate = new Date(date[0].start);
    //   const parsedEndDate = new Date(date[0].end);

    //   totalCount = await this.userModel.find({
    //     createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
    //     role: role
    //   }).countDocuments().exec();
    // } else if (search && role) {
    //   totalCount = await this.userModel.find({
    //     $or: [
    //       { userId: { $regex: search, $options: 'i' } },
    //       { phone: { $regex: search, $options: 'i' } },
    //       { first_name: { $regex: search, $options: 'i' } },
    //       { last_name: { $regex: search, $options: 'i' } }, // Case-insensitive search
    //       { country: { $regex: search, $options: 'i' } }, // Case-insensitive search
    //       { email: { $regex: search, $options: 'i' } }, // Case-insensitive search
    //       { gold_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
    //       { silver_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
    //       // Add more fields here
    //     ], role: role,
    //   }).countDocuments().exec();
    // } else if (search && date.length > 0) {

    //   let parsedStartDate = new Date(date[0].start);
    //   let parsedEndDate = new Date(date[0].end);
    //   totalCount = await this.userModel.find({
    //     $or: [
    //       { userId: { $regex: search, $options: 'i' } },
    //       { phone: { $regex: search, $options: 'i' } },
    //       { first_name: { $regex: search, $options: 'i' } },
    //       { last_name: { $regex: search, $options: 'i' } }, // Case-insensitive search
    //       { country: { $regex: search, $options: 'i' } }, // Case-insensitive search
    //       { email: { $regex: search, $options: 'i' } }, // Case-insensitive search
    //       { gold_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
    //       { silver_balance: { $regex: search, $options: 'i' } },  // Case-insensitive search

    //     ], createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
    //   }).countDocuments().exec();
    // } else if (role) {
    //   totalCount = await this.userModel.find({
    //     role: role,
    //   }).countDocuments().exec();
    // } else if (search) {
    //   totalCount = await this.userModel.find({
    //     $or: [
    //       { userId: { $regex: search, $options: 'i' } },
    //       { phone: { $regex: search, $options: 'i' } },
    //       { first_name: { $regex: search, $options: 'i' } },
    //       { last_name: { $regex: search, $options: 'i' } }, // Case-insensitive search
    //       { country: { $regex: search, $options: 'i' } }, // Case-insensitive search
    //       { email: { $regex: search, $options: 'i' } }, // Case-insensitive search
    //       { gold_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
    //       { silver_balance: { $regex: search, $options: 'i' } },  // Case-insensitive search
    //       // Add more fields here
    //     ],
    //   }).countDocuments().exec();
    // } else if (date.length > 0) {

    //   const parsedStartDate = new Date(date[0].start);
    //   const parsedEndDate = new Date(date[0].end);

    //   totalCount = await this.userModel.find({
    //     createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
    //   }).countDocuments().exec();
    // } else {
    //   totalCount = await this.userModel.countDocuments().exec();
    // }



    if (page < 1) {
      page = 1;
    } else if (page > totalPages) {
      page = totalPages;
    }

    const skip = (page - 1) * perPage;
    let data = await this.userModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(perPage).exec();
    // try {
    //   if (search && date.length > 0 && role) {
    //     let parsedStartDate = new Date(date[0].start);
    //     let parsedEndDate = new Date(date[0].end);
    //     data = await this.userModel.find({
    //       $or: [
    //         { userId: { $regex: search, $options: 'i' } },
    //         { phone: { $regex: search, $options: 'i' } },
    //         { first_name: { $regex: search, $options: 'i' } },
    //         { last_name: { $regex: search, $options: 'i' } }, // Case-insensitive search
    //         { country: { $regex: search, $options: 'i' } }, // Case-insensitive search
    //         { email: { $regex: search, $options: 'i' } }, // Case-insensitive search
    //         { gold_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
    //         { silver_balance: { $regex: search, $options: 'i' } },  // Case-insensitive search
    //       ],
    //       createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
    //       role: role,
    //     }).sort({ createdAt: -1 }).skip(skip).limit(perPage).exec();
    //   } else if (search && date.length > 0) {
    //     let parsedStartDate = new Date(date[0].start);
    //     let parsedEndDate = new Date(date[0].end);
    //     data = await this.userModel.find({
    //       $or: [
    //         { userId: { $regex: search, $options: 'i' } },
    //         { phone: { $regex: search, $options: 'i' } },
    //         { first_name: { $regex: search, $options: 'i' } },
    //         { last_name: { $regex: search, $options: 'i' } }, // Case-insensitive search
    //         { country: { $regex: search, $options: 'i' } }, // Case-insensitive search
    //         { email: { $regex: search, $options: 'i' } }, // Case-insensitive search
    //         { gold_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
    //         { silver_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
    //         // Add more fields here
    //       ], createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
    //     }).sort({ createdAt: -1 }).skip(skip).limit(perPage).exec();
    //   } else if (search && role) {
    //     data = await this.userModel.find({
    //       $or: [
    //         { userId: { $regex: search, $options: 'i' } },
    //         { phone: { $regex: search, $options: 'i' } },
    //         { first_name: { $regex: search, $options: 'i' } },
    //         { last_name: { $regex: search, $options: 'i' } }, // Case-insensitive search
    //         { country: { $regex: search, $options: 'i' } }, // Case-insensitive search
    //         { email: { $regex: search, $options: 'i' } }, // Case-insensitive search
    //         { gold_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
    //         { silver_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
    //         // Add more fields here
    //       ], role: role
    //     }).sort({ createdAt: -1 }).skip(skip).limit(perPage).exec();

    //   } else if (date.length > 0 && role) {
    //     const parsedStartDate = new Date(date[0].start);
    //     const parsedEndDate = new Date(date[0].end);
    //     data = await this.userModel.find({
    //       createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
    //       role: role,
    //     }).sort({ createdAt: -1 }).skip(skip).limit(perPage).exec();

    //   } else if (search) {
    //     data = await this.userModel.find({
    //       $or: [
    //         { userId: { $regex: search, $options: 'i' } },
    //         { phone: { $regex: search, $options: 'i' } },
    //         { first_name: { $regex: search, $options: 'i' } },
    //         { last_name: { $regex: search, $options: 'i' } }, // Case-insensitive search
    //         { country: { $regex: search, $options: 'i' } }, // Case-insensitive search
    //         { email: { $regex: search, $options: 'i' } }, // Case-insensitive search
    //         { gold_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
    //         { silver_balance: { $regex: search, $options: 'i' } },  // Case-insensitive search

    //         // Add more fields here
    //       ],
    //     }).sort({ createdAt: -1 }).skip(skip).limit(perPage).exec();

    //   } else if (date.length > 0) {
    //     const parsedStartDate = new Date(date[0].start);
    //     const parsedEndDate = new Date(date[0].end);
    //     data = await this.userModel.find({
    //       createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
    //     }).sort({ createdAt: -1 }).skip(skip).limit(perPage).exec();

    //   } else if (role) {

    //     data = await this.userModel.find({
    //       role: role,
    //     }).sort({ createdAt: -1 }).skip(skip).limit(perPage).exec();

    //   } else {
    //     data = await this.userModel.find().sort({ createdAt: -1 }).skip(skip).limit(perPage).exec();
    //   }
    // } catch (error) {
    //   data = [];
    // }

    return {
      data: data,
      currentPage: page,
      totalPages,
      perPage,
      total_count: totalCount,
    };


    // const user = await this.userModel.find();
    // return user;
  }
  
  async create(user: any): Promise<any> {
    ///// user phone is unique fix remain 
    //   const user = {
    //     "full_name":userobj.full_name,
    //     "email":userobj.email,
    //     "password":userobj.password,

    //     "phone":userobj.phone,
    //     "country":userobj.country,
    //     "refereal_code":userobj?.refereal_code?userobj.refereal_code:null
    // }
    // console.log(userobj?.refereal_code?userobj.refereal_code:null);
    const axiosInstance: AxiosInstance = this.httpService.axiosRef;
    let usercheck = await this.userModel.find({ $or: [{ email: user.email }, { phone: user.phone }] });

    if (!usercheck.length) {
      let getCoinValue = await this.signuprewardService.getCoinByUserCountry(user.country);
      if (user.refereal_code) {
        const getRefDetail = await this.refcodeService.getRefWithCode(user.refereal_code);
        if (getRefDetail) {

          //   return getRefDetail;
          const userRef = await this.findwithUserIdSelf(getRefDetail.user_id);
          // return userRef;
          const refRewardSetting = await this.refrewardService.getRefRewardByDate();

          if (refRewardSetting && getRefDetail && userRef) {


            const daycount = moment(this.getDate()).diff(moment(this.getDate(moment(getRefDetail.use_date) ? getRefDetail.use_date : "2023-01-01 00:00:00")), 'days') + 1;
            if (Number(refRewardSetting.days_limit) >= daycount && Number(getRefDetail.total_use) < Number(refRewardSetting.referral_limit)) {
              if (Number(refRewardSetting.silver_coin) > 0) {
                await this.UpdateUser(getRefDetail.user_id, Number(userRef['silver_balance']) + Number(refRewardSetting.silver_coin), "silver");
                const response = await axiosInstance.post('http://localhost:2053/silvers/apirequest/server/jk_y97wah', {
                  "coins": refRewardSetting.silver_coin,
                  "bal": refRewardSetting.silver_coin,
                  "remarks": "Added by refferal reward",
                  "client_id": getRefDetail.user_id,
                  "type": "credit"
                }).then((response) => {
                  console.log(JSON.stringify(response.data));
                })
                  .catch((error) => {
                    console.log(error);
                  });
              } if (Number(refRewardSetting.gold_coin) > 0) {
                await this.UpdateUser(getRefDetail.user_id, Number(userRef['gold_balance']) + Number(refRewardSetting.gold_coin), "gold");

                const response = await axiosInstance.post('http://localhost:2053/golds/apirequest/server/jk_y97wah', {
                  "coins": refRewardSetting.silver_coin,
                  "bal": refRewardSetting.silver_coin,
                  "remarks": "Added by refferal reward",
                  "client_id": getRefDetail.user_id,
                  "type": "credit"
                }).then((response) => {
                  console.log(JSON.stringify(response.data));
                })
                  .catch((error) => {
                    console.log(error);
                  });
              }
              await this.refcodeService.update(getRefDetail.id, { total_use: Number(getRefDetail.total_use) + 1, use_date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss') });
            }
          }
          ////////////////////when error fix then here code for update user coin who ref code found accouding to refreward/
        }
      }
      const lastRecords = await this.userModel.find().sort({ createdAt: -1 }).limit(1);
    
      
       var code = this.generateUniqueRandomString(8)
       var valRef = await this.refcodeService.getRefWithCode(code);
      if(valRef){
        var code = this.generateUniqueRandomString(12)
      }
      const refrral=code;
     
      const userVal = await this.userModel.create({
        ...user, silver_balance: getCoinValue?.silver_coin,
        gold_balance: getCoinValue?.gold_coin,
        "userId": lastRecords[0] ? Number(lastRecords[0]['userId']) + 1 : 1,
        referral_code:refrral,
      });
    
      this.refcodeService.registerUserRefCode(userVal._id,refrral)
      if (getCoinValue) {
        if (Number(getCoinValue.gold_coin) != 0 && Number(getCoinValue.silver_coin) != 0) {
          await axiosInstance.post('http://localhost:2053/silvers/apirequest/server/jk_y97wah', {
            "coins": getCoinValue.silver_coin,
            "bal": userVal.silver_balance,
            "remarks": "Added Signup reward",
            "client_id": userVal._id,
            "type": "credit"
          }).then((response) => {
            console.log("signupreward-silver", JSON.stringify(response.data));
          })
            .catch((error) => {
              console.log(error);
            });


          await axiosInstance.post('http://localhost:2053/golds/apirequest/server/jk_y97wah', {
            "coins": getCoinValue.gold_coin,
            "bal": userVal.gold_balance,
            "remarks": "Added Signup reward",
            "client_id": userVal._id,
            "type": "credit"
          }).then((response) => {
            console.log("signupreward-gold", JSON.stringify(response.data));
          })
            .catch((error) => {
              console.log(error);
            });
        }
        else if (Number(getCoinValue.gold_coin) != 0) {
          await axiosInstance.post('http://localhost:2053/golds/apirequest/server/jk_y97wah', {
            "coins": getCoinValue.gold_coin,
            "bal": userVal.gold_balance,
            "remarks": "Added Signup reward",
            "client_id": userVal._id,
            "type": "credit"
          }).then((response) => {
            console.log("signupreward-gold", JSON.stringify(response.data));
          })
            .catch((error) => {
              console.log(error);
            });
        } else if (Number(getCoinValue.silver_coin) != 0) {
          await axiosInstance.post('http://localhost:2053/silvers/apirequest/server/jk_y97wah', {
            "coins": getCoinValue.silver_coin,
            "bal": userVal.silver_balance,
            "remarks": "Added Signup reward",
            "client_id": userVal._id,
            "type": "credit"
          }).then((response) => {
            console.log("signupreward-silver", JSON.stringify(response.data));
          })
            .catch((error) => {
              console.log(error);
            });
        }
      }
      const payload = {
        id: userVal._id,
        name: userVal.full_name,
        country: user.country,
        email: userVal.email,
        status: userVal.status,
        role: userVal.role,

      };
      console.log("notification");
      await this.sendNotificationToUser(userVal.userId,"Thank you for register here.","register");

      return {
        status: true,
        user: userVal,
        access_token: await this.jwtService.signAsync(payload),

      }
      ///////// debit in admin account 



    }
    else {
      return {
        status: false,
        message: 'use unique email* or number'

      }
    }
    throw new BadRequestException('User already exists');
  }

  async clearAttempts(email: string) {
    await this.userModel.updateOne({ email: email }, { attempts: 0, status: 'active' });
    return "attempts clear"
  }
  async findByEmail(email: string): Promise<User> {

    const user = await this.userModel.findOne({ email: email });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }
  async findByPhone(phone: any): Promise<User> {

    const user = await this.userModel.findOne({ phone: phone });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  async findByPhoneForOtp(phone: any): Promise<Boolean> {

    const user = await this.userModel.findOne({ phone: phone });
    if (!user) {
      return false;
    }

    return true;
  }
  async findByEmailForOtp(email: string): Promise<Boolean> {
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      return false;
    } return true;
  }

  async update(id: any, body: any) {
    const userBefore = await this.userModel.findOne({ _id: id });
    const user = await this.userModel.findByIdAndUpdate(id, body);

    if (!user) {
      throw new NotFoundException('User not found.');
    }
    this.deleteUserFiles(userBefore.file_url);
    return { status: true, message: "User updated successfully" };
  }
  async updatePlayStatus(id: string, bet_block: string) {
    await this.userModel.updateOne({ _id: id }, { bet_block: bet_block });
    return this.userModel.findOne({ _id: id });
  }


  async remove(id: any) {
    const user = await this.userModel.findByIdAndDelete(id);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return { status: true, message: "User Delete successfully" };
  }

  async findwithUserIdSelf(id: any) {

    const user = await this.userModel.findById(id);

    if (!user) {
      return false;
    }

    return user;
  }
  async findwithUserId(id: any) {

    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }
  async singleUserByUserId(userId: any) {

    try {
      const user = await this.userModel.findOne({ userId: userId });

      if (!user) {
        throw new NotFoundException('User not found.');
      }

      return user;
    } catch (error) {
      console.log(error);
    }

  }


  async findwithUserRole(role: any) {

    const user = await this.userModel.find({ role: role });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  async findAllUserCount() {

    const operator = await this.userModel.countDocuments({ role: "operator", status: "active" });
    const player = await this.userModel.countDocuments({ role: "player", status: "active" });
    const blocked = await this.userModel.countDocuments({ status: "blocked" });
    //blocked
    //active
    return {
      operator: operator,
      player: player,
      blocked: blocked
    };
  }

  async findCountryWiseActive(role: string) {

    return await this.userModel.aggregate([
      {
        $match: { role: role, status: "active" }
      },
      {
        $group: {
          _id: "$country",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          country: "$_id",
          count: 1
        }
      },
      {
        $sort: { country: 1 } // Sort by "country" field in ascending order (1)
      }
    ]);
  }


  async statusWiseUsers(role: string) {

    return await this.userModel.aggregate([
      {
        $match: { role: role } // Remove the "status" from the $match stage
      },
      {
        $group: {
          _id: "$status", // Group only by "status"
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          status: "$_id", // Rename _id to status in the output
          count: 1
        }
      },
      {
        $sort: { status: 1 } // Sort by "status" field in ascending order (1)
      }
    ]);

  }


  async signUpGraph(role: string) {

    return await this.userModel.aggregate([
      {
        $match: { role: role } // Match documents with the desired role
      },
      {
        $addFields: {
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: { $toDate: "$createdAt" } // Convert to date
            }
          }
        }
      },
      {
        $group: {
          _id: "$date", // Group by the newly created 'date' field
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 } // Sort by Date in ascending order (1)
      }
    ]);


  }
  async getAllUser() {
    return await this.userModel.find({ $or: [{ role: "Player" }, { role: "player" }] }).select([
      "full_name",
      "country",
    ]);
  }

  async findUserbyId(id: string) {

    const user = await this.userModel.findOne({ _id: id });

    if (!user) {
      return false;
    }
 
    return user;
  }

  async findByUserIdForGold(userId: string) {
    return await this.userModel.findOne({ _id: userId });
  }

  async findByUserId(userId: string) {
    return await this.userModel.findOne({ userId: userId });
  }
  async findByID(_id: string) {
    return await this.userModel.findOne({ _id: _id });
  }

  async UpdateUser(user_id, data, type) {
    if (type == "silver") {
      return await this.userModel.updateOne({ _id: user_id }, { silver_balance: data });
    } else {
      return await this.userModel.updateOne({ _id: user_id }, { gold_balance: data });
    }

  }
  async getToken(token: string) {

    try {
      const response = await this.httpService
        .get("https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=" + token)
        .toPromise();

      const googleProfile = response.data;

      if (googleProfile.email_verified) {

        if (this.findByEmailForOtp(googleProfile.email)) {
          const userDetail = await this.findByEmail(googleProfile.email)
          const payload = {
            id: userDetail._id,
            name: userDetail.full_name,
            email: userDetail.email,
            country: userDetail.country,

            status: userDetail.status,
            role: userDetail.role,

          };
          return { status: true, user: userDetail, access_token: await this.jwtService.signAsync(payload), }

        } else {
          return { status: false, message: "email not found" }
        }
      } else {
        return { status: false, message: "Token is not valid." }; // Token is not valid
      }
    } catch (error) {
      // If there's an error, the token is likely invalid
      return { status: false, message: "Token is not valid." }; // Token is not valid

    }
  }

  getDate(value = null) {
    const date = new Date(value);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-indexed in JavaScript
    const year = date.getFullYear();
    // console.log(new Date(`${year}-${month}-${day}`));
    return new Date(`${year}-${month}-${day}`);
  }
  async fetchUserProfile(email: string): Promise<any> {

    const user = await this.userModel.findOne({ email: email });

    if (!user) {
      throw new NotFoundException('User not found.');
    }
    let r = (Math.random() * 36 ** 16).toString(36);

    const payload = {
      id: user._id,
      name: user.first_name + user.last_name,
      country: user.country,
      email: user.email,
      status: user.status,
      role: user.role,
      user_login_token: r
    };
    const access_token = await this.jwtService.signAsync(payload)


    return { "status": true, "user": user, "access_token": access_token };
  }

  async updateMobile(id: any, body: any) {
    const update = await this.userModel.findByIdAndUpdate(id, body);

    if (!update) {
      throw new NotFoundException('User not found.');
    }
    const user = await this.userModel.findOne({ _id: id });
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };
    const access_token = await this.jwtService.signAsync(payload)


    return { "status": true, "user": user, "access_token": access_token };
  }
  async forgotPasswordMobile(phone_no: string) {
    const user = await this.userModel.findOne({ phone: phone_no });

    if (user)
      return {
        status: true,
        message: "we successfully sent otp on given number",
        otpNumber: "9999",

      }
    else
      return {
        status: false,
        message: "phone number not matched",
        otpNumber: "9999",

      }
  }
  async updatePasswordMobile(phone_no: string, new_password: string) {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { phone: phone_no },
      { password: new_password }
    );

    if (updatedUser)
      return {
        status: true,
        message: 'password successfully updated'
      }
    else
      return {
        status: false,
        message: 'phone_no not matched'
      }
  }



  async getUserRenewTokenForMobile(id: string) {

    const user = await this.userModel.findOne({ _id: id });
    const payload = {
      id: user._id,
      country: user.country,
      email: user.email,
      role: user.role,
    };
    const access_token = await this.jwtService.signAsync(payload)


    return { "status": true, "user": user, "access_token": access_token };
  }

  async findUserByIdOrEmail(value) {
    // const query = {
    //   $or: [
    //     { userId: typeof value === 'number' ? value : NaN },
    //     { email: { $regex: typeof value === 'string' ? value : '', $options: 'i' } },
    //   ],
    // };

    // return await this.userModel.find(query).exec();
    const query = {};
    const numberPattern = /^[0-9]+(\.[0-9]+)?$/;
    if (numberPattern.test(value) && !isNaN(value)) {
      query['userId'] = String(value);
    } else if (typeof value === 'string') {
      query['email'] = { $regex: value, $options: 'i' };
    }
    query['role'] = 'player';
    const user = await this.userModel.findOne(query).select('-password').exec();
    if (user) {
      return { status: true,message:"User Detail Found.", user: user };
    } else {
      return { status: false, message: "User not found" };
    }
  }

  async verifyAdminToken(token) {
    const adminToken = await this.userModel.findOne({ user_login_token: token })
    return { status: adminToken ? true : false };
  }


  async UpdateUserPassword(user_id, data) {
    const user = await this.userModel.updateOne({ _id: user_id }, { password: data });
    if (user) {
      return { status: true, message: "User update Successfully" }
    } else {
      return { status: false, "message": "Some went wrong." };
    }
  }
  async findOperatorWithCountry(country) {
    return await this.userModel.find({
      $or: [
        { country: { $regex: country, $options: 'i' } },
      ],
      role: 'operator'
    });
  }
   randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  generateUniqueRandomString(length) {
    let randomString = "";
    const usedCharacters = new Set();
  
    for (let i = 0; i < length; i++) {
      let randomCharacter = this.randomInt(65, 90);
  
      while (usedCharacters.has(randomCharacter)) {
        randomCharacter = this.randomInt(65, 90);
      }
  
      usedCharacters.add(randomCharacter);
      randomString += String.fromCharCode(randomCharacter);
    }
  
    return randomString;
  }
  async deleteUserFiles(file_url){
    
      const fileDel = await fs.unlink(`./public/${file_url}`, (err) => {
        if (err) {
         console.error(err);
         return err;
        }
       });
       return fileDel;
    
  }

}
