import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { HttpException } from '@nestjs/common/exceptions';
///////////////////not use any where//////////////////////

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:
        'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.',
    });
  }

  async validate(user_id: any): Promise<any> {
    const user = await this.authService.validateUser(user_id);
    if (!user) {
      throw new HttpException('Invalid token', 403);
    }
    return user;
  }
}
