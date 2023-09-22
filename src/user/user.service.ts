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



@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
    private signuprewardService: SignupRewardsService,
    private refcodeService: ReferralCodesService,
    private refrewardService: ReferralRewardsService,
    private coinTraService: CoinTrasService,
    private jwtService: JwtService,
    private readonly httpService: HttpService

  ) { }
  /*
  date for start and end date

   async searchByDateRange(startDate: Date, endDate: Date): Promise<User[]> {
const users = await this.userModel.find({
created_at: { $gte: startDate, $lte: endDate },
}).exec();
return users;
   }*/
  async findAll(page = 0, perPage = 20, search = false, date = [], role = false) {
    let totalCount = 0
    if (search && date.length > 0 && role) {
      let parsedStartDate = new Date(date[0].start);
      let parsedEndDate = new Date(date[0].end);
      totalCount = await this.userModel.find({
        $or: [
          { full_name: { $regex: search, $options: 'i' } }, // Case-insensitive search
          { country: { $regex: search, $options: 'i' } }, // Case-insensitive search
          { email: { $regex: search, $options: 'i' } }, // Case-insensitive search
          { gold_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
          { silver_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search

          // Add more fields here
        ],
        createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
        role: role,
      }).countDocuments().exec();
    } else if (date.length > 0 && role) {
      const parsedStartDate = new Date(date[0].start);
      const parsedEndDate = new Date(date[0].end);

      totalCount = await this.userModel.find({
        createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
        role: role
      }).countDocuments().exec();
    } else if (search && role) {
      totalCount = await this.userModel.find({
        $or: [
          { full_name: { $regex: search, $options: 'i' } }, // Case-insensitive search
          { country: { $regex: search, $options: 'i' } }, // Case-insensitive search
          { email: { $regex: search, $options: 'i' } }, // Case-insensitive search
          { gold_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
          { silver_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
          { role: { $regex: search, $options: 'i' } }, // Case-insensitive search
          // Add more fields here
        ], role: role,
      }).countDocuments().exec();
    } else if (search && date.length > 0) {

      let parsedStartDate = new Date(date[0].start);
      let parsedEndDate = new Date(date[0].end);
      totalCount = await this.userModel.find({
        $or: [
          { full_name: { $regex: search, $options: 'i' } }, // Case-insensitive search
          { country: { $regex: search, $options: 'i' } }, // Case-insensitive search
          { email: { $regex: search, $options: 'i' } }, // Case-insensitive search
          { gold_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
          { silver_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search

        ], createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
      }).countDocuments().exec();
    } else if (role) {

      totalCount = await this.userModel.find({
        role: role,
      }).countDocuments().exec();
    }
    else if (search) {
      totalCount = await this.userModel.find({
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
    } else if (date.length > 0) {

      const parsedStartDate = new Date(date[0].start);
      const parsedEndDate = new Date(date[0].end);

      totalCount = await this.userModel.find({
        createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
      }).countDocuments().exec();
    } else {
      totalCount = await this.userModel.countDocuments().exec();
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
            { full_name: { $regex: search, $options: 'i' } }, // Case-insensitive search
            { country: { $regex: search, $options: 'i' } }, // Case-insensitive search
            { email: { $regex: search, $options: 'i' } }, // Case-insensitive search
            { gold_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
            { silver_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
          ],
          createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
          role: role,
        }).skip(skip).limit(perPage).exec();
      } else if (search && date.length > 0) {
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
      } else if (search && role) {
        data = await this.userModel.find({
          $or: [
            { full_name: { $regex: search, $options: 'i' } }, // Case-insensitive search
            { country: { $regex: search, $options: 'i' } }, // Case-insensitive search
            { email: { $regex: search, $options: 'i' } }, // Case-insensitive search
            { gold_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
            { silver_balance: { $regex: search, $options: 'i' } }, // Case-insensitive search
            { role: { $regex: search, $options: 'i' } }, // Case-insensitive search
            // Add more fields here
          ], role: role
        }).skip(skip).limit(perPage).exec();

      } else if (date.length > 0 && role) {
        const parsedStartDate = new Date(date[0].start);
        const parsedEndDate = new Date(date[0].end);
        data = await this.userModel.find({
          createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
          role: role,
        }).skip(skip).limit(perPage).exec();

      } else if (search) {
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

      } else if (date.length > 0) {
        const parsedStartDate = new Date(date[0].start);
        const parsedEndDate = new Date(date[0].end);
        data = await this.userModel.find({
          createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
        }).skip(skip).limit(perPage).exec();

      } else if (role) {

        data = await this.userModel.find({
          role: role,
        }).skip(skip).limit(perPage).exec();

      } else {
        data = await this.userModel.find().skip(skip).limit(perPage).exec();
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

                await this.UpdateUser(getRefDetail.user_id, Number(userRef.silver_balance) + Number(refRewardSetting.silver_coin), "silver");

              } if (Number(refRewardSetting.gold_coin) > 0) {
                await this.UpdateUser(getRefDetail.user_id, Number(userRef.gold_balance) + Number(refRewardSetting.gold_coin), "gold");
              }
              await this.refcodeService.update(getRefDetail.id, { total_use: Number(getRefDetail.total_use) + 1, use_date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss') });

            }

          }
          ////////////////////when error fix then here code for update user coin who ref code found accouding to refreward/
        }
      }
      const lastRecords = await this.userModel.find().sort({ createdAt: -1 }).limit(1);

      const userVal = await this.userModel.create({
        ...user, silver_balance: getCoinValue?.silver_coin,
        gold_balance: getCoinValue?.gold_coin,
        "userId": lastRecords[0] ? Number(lastRecords[0]['userId']) + 1 : 1,
      });
      const payload = {
        id: userVal._id,
        name: userVal.full_name,
        country: user.country,
        email: userVal.email,
        status: userVal.status,
        role: userVal.role,

      };
      return {
        status: true,
        user: userVal,
        access_token: await this.jwtService.signAsync(payload),

      }
      ///////// debit in admin account 



    }
    else {
      return 'use unique email & password'
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
    const user = await this.userModel.findByIdAndUpdate(id, body);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return { status: true, message: "User updated successfully" };
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
              date: "$createdAt"
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
    try {
      new mongoose.Types.ObjectId(id);
    } catch (e) {
      return false;
    }

    const user = await this.userModel.findOne({ _id: id });
    if (!user) {
      return false;
    }
    return user;
  }

  async findByUserId(userId: string) {
    return await this.userModel.findOne({ userId: userId });
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

}
