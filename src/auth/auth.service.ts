 

import { Injectable, UnauthorizedException ,NotAcceptableException} from '@nestjs/common';
import { UserService as UsersService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(username, pass) {
   
    const user = await this.usersService.findById(username);
   
    if(user.status !== 'active'){
      throw new NotAcceptableException("User is invalid, try to contact admin")
    }
    if (user?.password !== pass && user.role=="Client"  ) {
      throw new UnauthorizedException();
    }
    const payload = { id:user._id,name: user.full_name, email: user.email,status:user.status,role:user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}