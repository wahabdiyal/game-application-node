import { Controller,
    Get,
     Patch,
      Body,
       Param,
        Post,
         Delete,
          NotFoundException,
           UseGuards,
           Request
        } from '@nestjs/common';
 
import { AuthGuard } from 'src/auth/auth.guard';
import { SilversService } from './silvers.service';

@Controller('api/user')
@UseGuards(AuthGuard)///////// for bearer token authentication/////// for all controller
export class UserSilverController {
    constructor(
        private readonly silversService: SilversService
        
        ) {}

   
   @Post('send/coin')
   @UseGuards(AuthGuard)
     shareCoinUser(@Body() user ,@Request() req)  {

    return this.silversService.shareCoinUser(user,req.user);

        
   }


}