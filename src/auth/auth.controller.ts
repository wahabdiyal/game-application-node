import { Controller, Get, Body, Post,Param,Req } from '@nestjs/common';
import { User } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
    constructor(private userService: UserService,) { }

    @Get('/login')

    async getUser(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Post('login')
    async createBook(
        @Body()
        user
    ): Promise<User> {
        return this.userService.create(user);
    }
    @Get(':id')
  async getBook(
    @Param('id')
    id: string,@Req() req ,
  ): Promise<User> {
    /////for get request query param req.query 
    console.log(req);
    return this.userService.findById(id);
  }
}
