import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserApiController } from './userApi.controller';
import { SilversModule } from 'src/silvers/silvers.module';
 

@Module({
    imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]) ],
    controllers: [UserController,UserApiController],
    providers: [UserService  ],
    exports: [UserService],
  })
  export class UserModule {}
