import { Controller, Get, Patch, Body, Param, Post, Delete, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';

@Controller('user')
export class UserController {
    constructor(private userService: UserService,){}

    @Get('/')
    async getUser(): Promise<User[]>{
        return this.userService.findAll();
    }

    @Get(':id')
    async singleUser(id:any): Promise<User>{
        return this.userService.findwithUserId(id);
    }

    @Patch(':id')
    update(@Param('id') id: any, @Body() updateRewardDto:any) {
        console.log(updateRewardDto);
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
}
