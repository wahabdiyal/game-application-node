import { Controller,
    Get,
     Patch,
      Body,
       Param,
        Post,
         Delete,
          NotFoundException,
           UseGuards,
           Request,
           Query
        } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('api/user')
@UseGuards(AuthGuard)///////// for bearer token authentication/////// for all controller
export class UserApiController {
   constructor(
       private userService: UserService,
       
       ){}

   @Get('/')
   async getUser(@Query() {skip,limit}) {
    return this.userService.findAll(skip, limit);
   }
//    @Post('send/coin')
//    @UseGuards(AuthGuard)
//    async createBook(@Body() user ,@Request() req)  {
//        return { data :req.user, user };
//    }


}