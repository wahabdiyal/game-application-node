import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,Param
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { User } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';
 

@Controller('auth')
export class AuthController {
    constructor(private userService: UserService,private authService: AuthService) { }
    @UseGuards(AuthGuard)
    @Get('/login')

    async getUser(): Promise<User[]> {
        return this.userService.findAll();
    }

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

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
      return req.user;
    }

    @Get(':id')
    async getBook(
    @Param('id')
    id: string,@Request() req ,
     ): Promise<User> {
    /////for get request query param req.query 
    console.log(req);
    return this.userService.findById(id);
  }
}
