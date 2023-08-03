import { Module } from '@nestjs/common';
import { UserRightService } from './user_right.service';
import { UserRightController } from './user_right.controller';

@Module({
  controllers: [UserRightController],
  providers: [UserRightService]
})
export class UserRightModule {}
