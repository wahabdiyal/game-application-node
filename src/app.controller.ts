import { Controller, Get, Render, Req, Session } from '@nestjs/common';
import { AppService } from './app.service';
 
 

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()

   @Render('pages/index.hbs')
  root(@Req() request,@Session() session: Record<string, any> ) {
    request.session.visits = request.session.visits ? request.session.visits + 1 : 1;
    session.valueForValue1 = true;

    return { message: "hello world!",
              people: [
                "Yehuda Katz",
                "Alan Johnson",
                "Charles Jolley",
              ],
              person: {
                firstname: "Yehuda",
                lastname: "Katz",
              },
              nav: [
                { url: "http://www.yehudakatz.com", title: "Katz Got Your Tongue" },
                { url: "http://www.sproutcore.com/block", title: "SproutCore Blog" }
              ],
              session: request.session.visits
              
        };
  }
  @Get('hello')
  findAlla(@Session() session: Record<string, any>) {
     
      return session;
    
}

}
