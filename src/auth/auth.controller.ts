
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards, Ip, Query, Param
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { User } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';


@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,

  ) { }
  @UseGuards(AuthGuard)
  @Get('/login')
  async getUser(@Query() { skip, limit }) {
    return this.userService.findAll(skip, limit);
  }

  @Post('phone/otp')
  async sendOtp(@Body() data) {
    const user = await this.userService.findByPhoneForOtp(data.phone);
    if (user) {
      return { status: false, message: "User found try with an other number." };
    }
    const email = await this.userService.findByEmailForOtp(data.email);
    if (email) {
      return { status: false, message: "User found try with an other email." };
    }
    // const OTP_LENGTH = 4;
    // const otp = Math.floor(Math.random() * 10000) + 1000;

    // // Convert the number to a string and remove all characters except numbers.
    // let otpStr = otp.toString().replace(/[^\d]/g, '');

    // // If the resulting string is less than 4 digits long, pad it with zeros.
    // if (otpStr.length < OTP_LENGTH) {
    //   otpStr = `0${otpStr}`;
    // }
    //     const accountSid = 'ACf82707de3697a71e255440cd4be4427c';
    //     const authToken = '8aa667a9bf75bec466f0866afbd1bfc9';
    //    const client = require('twilio')(accountSid, authToken);
    //           const status = await client.messages.create({
    //               body: otpStr,
    //               to: data.phone, // Text your number
    //               from: '+18777991953', // From a valid Twilio number
    //             }) ;
    // status.sid

    if (true) {
      return {
        status: true,
        otp: 9999
      }
    } else {
      return {
        status: false,
        Message: "Something went wrong"
      }
    }


  }

  @Post('/google/token')
  async token(@Body() param) {
    return await this.userService.getToken(param.token);
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  async createBook(
    @Body()
    user
  ): Promise<User> {
    return this.userService.create(user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {

    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login/admin')
  loginadmin(@Body()
  user) {
    return this.authService.loginAdmin(user.email, user.password, user.ip, user.deviceToken);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login/phone')
  loginwithphone(@Body() signInDto: Record<string, any>) {

    return this.authService.loginwithphone(signInDto.phone, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.userService.fetchUserProfile(req.user.email);

  }



  @UseGuards(AuthGuard)
  @Get('forgot-password/:phone_no')
  forgotPasswordMobile(@Param('phone_no') phone_no: string) {
    return this.userService.forgotPasswordMobile(phone_no);
  }

  @UseGuards(AuthGuard)
  @Post('update-password')
  updatePasswordMobile(@Body() details) {
    return this.userService.updatePasswordMobile(details.phone_no, details.new_password);
  }



}
