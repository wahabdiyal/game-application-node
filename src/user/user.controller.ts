import { storage } from './../config/storage.config';
import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  Post,
  Delete,
  NotFoundException,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import crypto from 'crypto';
import { LoginLogsService } from 'src/login_logs/login_logs.service';

@Controller('user')
@UseGuards(AuthGuard)///////// for bearer token authentication/////// for all controller
export class UserController {
  constructor(
    private userService: UserService,
    private loginLogsService: LoginLogsService,

  ) { }

  @Get('/')
  async getUser(@Request() req, @Query() { page, perpage, search, start_date, end_date, role }) {
    let date = (start_date && end_date) ? [{ start: start_date, end: end_date }] : [];

    if (req.user.role == 'operator') {

      return this.userService.findAllForOperator(page, perpage, search, date, role, req.user.country);
    } else if (req.user.role == 'admin') {
      return this.userService.findAll(page, perpage, search, date, role);
    } else {
      return {
        data: [],
        currentPage: 0,
        total_count: 0,
        message: "user not allowed"
      };
    }

  }

  @Get(':id')
  async singleUser(@Param('id') id: any): Promise<User> {
    return this.userService.findwithUserId(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor(
      "picture", // name of the field being passed
      { storage }
    )
  )
  update(@Param('id') id: any, @UploadedFile() file: Express.Multer.File, @Body() updateRewardDto: any) {
    return this.userService.update(id, { ...updateRewardDto, file_url: file ? (file.path.replace("public\\", "")).replace("\\", "/").replace("public/", "") : undefined });
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
    return { status: true, message: 'User deleted successfully' };
  }
  @Get('findby/role/:role')
  findwithUserRole(@Param('role') role: any) {
    return this.userService.findwithUserRole(role);
  }
  @Post('/destroy')
  deleteToken(@Request() req) {
    return req.header('Authorization');
  }

  @Patch('clear-attempts/:email')
  clearAttempts(@Param('email') email: any) {
    return { status: true, message: this.userService.clearAttempts(email) };
  }
  @Get('find-all-user-count/all') // Note the '?' to make it optional
  findAllUserCount() {
    return this.userService.findAllUserCount();
  }

  @Get('find-country-wise-active-users/:role') // for chart
  findCountryWiseActive(@Param('role') role: any) {
    return this.userService.findCountryWiseActive(role);
  }
  @Get('status-wise-users/:role') // for chart
  statusWiseUsers(@Param('role') role: any) {
    return this.userService.statusWiseUsers(role);
  }

  @Get('operators-visits/all') // for chart
  operatorsVisits() {
    return this.loginLogsService.operatorsVisits();
  }


  @Get('sign-up-graph/:role') // for chart
  signUpGraph(@Param('role') role: any) {
    return this.userService.signUpGraph(role);
  }



  @Post('mobile/profile/:id')
  @UseInterceptors(
    FileInterceptor(
      "picture", // name of the field being passed
      { storage }
    )
  )
  updatemobile(@Param('id') id: any, @UploadedFile() file: Express.Multer.File, @Body() updateRewardDto: any) {
    return this.userService.updateMobile(id, { ...updateRewardDto, file_url: file ? (file.path.replace("public\\", "")).replace("\\", "/").replace("public/", "") : undefined });

  }

  @Post('mobile/update/password')
  @UseInterceptors(FileInterceptor("form-data"))
  async updatepasswordmobile(@Body() body: any, @Request() req) {
    if (!body['newpassword'] || !body['oldpassword']) {
      return { status: false, message: "Field not found" };
    }
    const user = await this.userService.findByID(req.user.id);
    if (user && user['password'] === body['oldpassword']) {
      return this.userService.UpdateUserPassword(req.user.id, body['newpassword']);
    } else {
      return { status: false, message: "Password is not valid." }
    }

  }

  @Get('mobile/search/emailorid/:role') // for chart
  findUserByIdOrEmail(@Param('role') role: any) {
    return this.userService.findUserByIdOrEmail(role);
  }

  @Patch('update-play-status/player') // The endpoint for updating play status
  updatePlayStatus(@Query() { id, bet_block }) {
    return this.userService.updatePlayStatus(id, bet_block);
  }
  @Get('admin/verify-token/:token') // The endpoint for updating play status
  verifyAdminToken(@Param('token') token: any) {
    return this.userService.verifyAdminToken(token);
  }
}
