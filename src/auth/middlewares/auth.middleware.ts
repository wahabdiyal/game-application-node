import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Mongoose } from 'mongoose';
@Injectable()
 
export class AuthMiddleware implements NestMiddleware {
  // constructor(private readonly mongoose: Mongoose) {}

  use(req: Request, res: Response, next: NextFunction) {
    // const users = this.mongoose.model('users').find();
    // next(users);
  }
}
