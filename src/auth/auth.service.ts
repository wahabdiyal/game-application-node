import { HttpException } from '@nestjs/common/exceptions';
import { Injectable, UnauthorizedException, NotAcceptableException } from '@nestjs/common';
import { UserService as UsersService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AllowedIpsService } from 'src/allowed_ips/allowed_ips.service';
import mongoose from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { AllowedIP } from 'src/allowed_ips/schemas/allowed_ips.schema';
import { LoginLogs } from 'src/login_logs/schemas/login_logs.schema';
import { LoginLogsService } from 'src/login_logs/login_logs.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private loginLogsService: LoginLogsService,
    private jwtService: JwtService,
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,


    // @InjectModel(AllowedIP.name)
    // private allowedIPService: mongoose.Model<AllowedIP>,
    private listIpService: AllowedIpsService
  ) { }
  async validateUser(user_id) {
    const user = await this.usersService.findUserbyId(user_id);
    if (!user) {
      throw new HttpException('Invalid token', 403);
    }
    return user;
  }
  async signIn(email, pass) {

    const user = await this.usersService.findByEmail(email);

    if (user.status !== 'active') {
      throw new NotAcceptableException("User is invalid, try to contact admin")
    }
    //&& user.role=="player" 
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = {
      id: user._id,
      name: user.first_name + user.last_name,
      email: user.email,
      country: user.country,
      status: user.status,
      role: user.role,
    };
    return {
      status: true,
      user: user,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  async loginwithphone(phone, pass) {

    const user = await this.usersService.findByPhone(phone);

    if (user.status !== 'active' && user.role != "player") {
      throw new NotAcceptableException("User is invalid, try to contact admin")
    }
    //&& user.role=="player" 

    if (user?.password !== pass) {
      throw new NotAcceptableException("password is not valid");

    }
    const payload = {
      id: user._id,
      name: user.first_name + user.last_name,
      country: user.country,
      email: user.email,
      status: user.status,
      role: user.role,

    };
    return {
      status: true,
      user: user,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async loginAdmin(email, pass, ip, deviceToken) {
    let status = false;
    let message = "";
    let access_token = "";

    let user = await this.userModel.findOne({ email: email, password: pass });
    let checkBlock = await this.userModel.findOne({ email: email });
    // check for block directly
    if (checkBlock && (checkBlock.attempts > 5 || checkBlock.status !== 'active')) { status = false; message = "user blocked, contact admin"; user = null }
    /////handle invalid,player & wrong attempts attempts increments
    else if (!user || user.role == "player") {
      await this.userModel.updateOne({ email: email }, { $inc: { attempts: 1 } });
      status = false; message = "invalid user"
    }
    /////handle block user & max attempts
    else if (user.attempts > 5 || user.status !== 'active') {
      if (user.attempts > 5)
        await this.usersService.update({ _id: user.id }, { status: 'blocked' });
      status = false; message = "user blocked, contact admin"; user = null
    }
    else {
      ///check for allowed ip
      const IPallowed = await this.listIpService.findUserIp(ip, user._id.toString());
      if (IPallowed == null && user.role == 'admin') { status = false; message = "ip not allowed, contact admin"; user = null }
      else {

        const operatorIP = await this.listIpService.findUserIpByUser(user._id.toString());
        if (operatorIP != null && IPallowed == null && user.role == 'operator') { status = false; message = "ip not allowed, contact admin"; user = null }
        ///proceed for success login
        else {
          ///update device token
          await this.userModel.findByIdAndUpdate(user._id, { deviceToken: deviceToken });

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
          access_token = await this.jwtService.signAsync(payload)



          ///destroy the token

          // user.user_login_token;

          await this.usersService.update({ _id: user.id }, { user_login_token: access_token });
          status = true; message = "success"
          if (user.role == 'admin')
            await this.loginLogsService.create({ user: user._id, ip_address: ip, action_type: "login" })
        }
      }
    }

    return {
      status: status,
      message: message,
      user: user,
      access_token: access_token,
    };

  }
}