import { HttpException } from '@nestjs/common/exceptions';
import { Injectable, UnauthorizedException ,NotAcceptableException} from '@nestjs/common';
import { UserService as UsersService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AllowedIpsService } from 'src/allowed_ips/allowed_ips.service';
 
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private listIpService: AllowedIpsService
  ) {}
async validateUser(user_id){
  const user = await this.usersService.findUserbyId(user_id);    
  if (!user) {
      throw new HttpException('Invalid token',403);    
  }    
  return user;      
}
  async signIn(email, pass) {
  
    const user = await this.usersService.findByEmail(email);
  
    if(user.status !== 'active'){
      throw new NotAcceptableException("User is invalid, try to contact admin")
    }
    //&& user.role=="player" 
    if (user?.password !== pass  ) {
      throw new UnauthorizedException();
    }
    const payload = { 
      id:user._id,
      name: user.first_name+user.last_name, 
      email: user.email,
      country: user.country,
      status:user.status,
      role:user.role,
    };
    return {
      status:true,
      user:user,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  async loginwithphone(phone, pass) {
  
    const user = await this.usersService.findByPhone(phone);
  
    if(user.status !== 'active'){
      throw new NotAcceptableException("User is invalid, try to contact admin")
    }
    //&& user.role=="player" 
    if (user?.password !== pass  ) {
      throw new NotAcceptableException("password is not valid");
    }
    const payload = { 
      id:user._id,
      name: user.first_name+user.last_name, 
      country: user.country,
      email: user.email,
      status:user.status,
      role:user.role,
   
    };
    return {
      status:true,
      user:user,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async loginAdmin(email, pass,ip) {
    
    const user = await this.usersService.findByEmail(email);
   
    if(user.status !== 'active' ){
      throw new NotAcceptableException("User Blocked, Not Allowed Access")
    }
    const getIp  = await this.listIpService.findUserIp(ip,user.id);
  
    if (getIp['status'] == false) {
      throw new NotAcceptableException("Not Allowed Access")
    }
    // if(user.user_ip==null){
    //   await this.usersService.update({_id:user.id},{user_ip:ip});
    // }
    
    if (user?.password !== pass && user.role=="player") {
      throw new UnauthorizedException();
    }
    
    let r = (Math.random() * 36**16).toString(36);
     
    await this.usersService.update({_id:user.id},{user_login_token: r});
    const payload = { 
      id:user._id,
      name: user.first_name+user.last_name, 
      country: user.country,
      email: user.email,
      status:user.status,
      role:user.role,
      user_login_token:r
     };
    return {
      status:true,
      user:await this.usersService.findByEmail(email),
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}