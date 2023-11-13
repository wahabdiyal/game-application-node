import { Module } from '@nestjs/common';
import { UserRightsService } from './user-rights.service';
import { UserRightsController } from './user-rights.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRightSchema } from './schemas/user-rights.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'UserRights', schema: UserRightSchema }])],
  controllers: [UserRightsController],
  providers: [UserRightsService],
})
export class UserRightsModule {}
