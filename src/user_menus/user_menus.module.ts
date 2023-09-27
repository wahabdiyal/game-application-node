import { Module } from '@nestjs/common';
import { UserMenusService } from './user_menus.service';
import { UserMenusController } from './user_menus.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserMenuSchema } from './schemas/user_menu.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'UserMenu', schema: UserMenuSchema }])],
  controllers: [UserMenusController],
  providers: [UserMenusService],
})
export class UserMenusModule { }
