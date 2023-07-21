 

import { Injectable, UnauthorizedException } from '@nestjs/common';
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
    console.log(user.password);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { name: user.name, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}