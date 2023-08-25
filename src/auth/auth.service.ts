 

import { Injectable, UnauthorizedException ,NotAcceptableException} from '@nestjs/common';
import { UserService as UsersService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

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
      name: user.full_name, 
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
  async loginwithphone(phone, pass) {
  
    const user = await this.usersService.findByPhone(phone);
  
    if(user.status !== 'active'){
      throw new NotAcceptableException("User is invalid, try to contact admin")
    }
    //&& user.role=="player" 
    if (user?.password !== pass  ) {
      throw new UnauthorizedException();
    }
    const payload = { 
      id:user._id,
      name: user.full_name, 
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
}