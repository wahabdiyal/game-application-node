import { Module } from '@nestjs/common';
import { LoginLogsService } from './login_logs.service';
import { LoginLogsController } from './login_logs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LoginLogsSchema } from './schemas/login_logs.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'LoginLogs', schema: LoginLogsSchema }])],
  controllers: [LoginLogsController],
  providers: [LoginLogsService],
  exports: [LoginLogsService],

})
export class LoginLogsModule { }
