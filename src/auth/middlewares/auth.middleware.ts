import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserService as UsersService } from 'src/user/user.service';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class AuthMiddleware implements NestMiddleware {
 
  constructor(
    private usersService: UsersService,
  ){}
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    // if (authHeader && authHeader.startsWith('Bearer ')) {
    //   const token = authHeader.slice(7); // Remove 'Bearer ' from the token string
      
    //   try {
       
    //     const decodedToken = jwt.verify(token, 'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.'); // Replace with your actual secret  
    //     const user = await this.usersService.findByEmail(decodedToken['email'])
         
    //     req['user'] = decodedToken;
    //     console.log(decodedToken,user);
    //     if(decodedToken['user_login_token'] !== user['user_login_token']){
    //     return res.status(401).json({ message: 'Login token is not valid.' });
    //     }
        
    //   } catch (error) {
        
    //     return res.status(401).json({ message: 'Unauthorized Token is missing.' });
    //   }
    // }
    // console.log("Token not valid")
//////////// token condtion for every request of token//////////////////////////
    next();
 
  }
}
