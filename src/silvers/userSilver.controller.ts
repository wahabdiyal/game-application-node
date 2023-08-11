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
import { UserService } from 'src/user/user.service';
import { GoldsService } from 'src/golds/golds.service';

@Controller('api/user')
@UseGuards(AuthGuard)///////// for bearer token authentication/////// for all controller
export class UserSilverController {
    constructor(
        private readonly silversService: SilversService,
        private readonly userService: UserService,
        private readonly goldService: GoldsService
        
        ) {}

   
   @Post('send/coin')
   @UseGuards(AuthGuard)
    async shareCoinUser(@Body() body ,@Request() req)  {
        let userSend = await this.userService.findwithUserId(req.user.id);
        // let userRecev = await this.userService.findwithUserId(body.client_id);
        
         
        // if('silver' =='silver'){
            if(Number(userSend.silver_balance) > 0){
                    let payto = await this.silversService.create({
                        'client_id': body.client_id,
                        'remarks': req.user.id+" send to "+body.client_id,
                        'type':"credit",
                        'coins':body.coins
                });
                let paidby = await this.silversService.create({
                    'client_id': req.user.id,
                    'remarks': req.user.id+" send from "+body.client_id,
                    'type':"debit",
                    'coins':body.coins
                    });
                    console.log(paidby , payto);
                    return {"success":true,"data_pay_to":payto,"data_paid_by":paidby}
            }else{
                return {"status": "error", "message":"Error Coin sending "+userSend.silver_balance};
            }
        // }
        // else if(body.type =='gold'){
        //     if(Number(userSend.gold_balance) > 0){
        //             let payto = await this.goldService.create({
        //                 'client_id': body.client_id,
        //                 'remarks': req.user.id+"send to"+body.client_id,
        //                 'type':"credit",
        //                 'coins':body.coins
        //         });
        //         let paidby =await this.goldService.create({
        //             'client_id': req.user.id,
        //             'remarks': req.user.id+" send from "+body.client_id,
        //             'type':"debit",
        //             'coins':body.coins
        //             });
        //             return {"success":true,"data_pay_to":payto,"data_paid_by":paidby}
        //     }
            
        //     else{
        //         return {"status": "error", "message":"Error Coin sending"+userSend.gold_balance};
        //     }
        // }
        
        // else{
        //     return {"status": "error", "message":"Error Type not found"};
             
        // }
         
         

        
   }


}