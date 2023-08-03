import { Module } from '@nestjs/common';
import { UserRightService } from './user_right.service';
import { UserRightController } from './user_right.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRightSchema } from './schemas/user_right.schema';

@Module({
  imports:[MongooseModule.forFeature([{ name: 'UserRight', schema: UserRightSchema }])],
  controllers: [UserRightController],
  providers: [UserRightService],
  exports: [UserRightService],
})
export class UserRightModule {}
