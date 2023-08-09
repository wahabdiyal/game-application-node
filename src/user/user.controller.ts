import { Controller,
     Get,
      Patch,
       Body,
        Param,
         Post,
          Delete,
           NotFoundException,
            UseGuards,
            Query
         } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
@UseGuards(AuthGuard)///////// for bearer token authentication/////// for all controller
export class UserController {
    constructor(
        private userService: UserService,
        
        ){}

    @Get('/')
    async getUser(@Query() {page,perpage,search,start_date,end_date,role}) {
      let date = (start_date && end_date)?[{start:start_date,end:end_date}]:[];
      return this.userService.findAll(page, perpage,search,date,role);
    }

    @Get(':id')
    async singleUser(@Param('id') id:any): Promise<User>{
        return this.userService.findwithUserId(id);
    }

    @Patch(':id')
    update(@Param('id') id: any, @Body() updateRewardDto:any) {
        return this.userService.update(id, updateRewardDto);
      }

      @Post('create')
    async createBook(
        @Body()
        user
    ): Promise<User> {
        return this.userService.create(user);
    }
   @Delete(':id')
    remove(@Param('id') id: any) {
        const user = this.userService.remove(id);
        if (!user) {
          throw new NotFoundException(`Record with ID: ${id} not found`);
        }
        return {status:true, message: 'User deleted successfully' };
  }
  @Get('findby/role/:role')
  findwithUserRole(@Param('role') role: any) {
    return  this.userService.findwithUserRole(role);

  }

 
}
