import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SignupRewardsModule } from 'src/signup_rewards/signup_rewards.module';
 
 
 

@Module({
    imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),SignupRewardsModule,],
    controllers: [UserController ],
    providers: [UserService],
    exports: [UserService],
  })
  export class UserModule {}
