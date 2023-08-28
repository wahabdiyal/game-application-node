import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GamesSchema } from './schemas/games.schema';

@Module({
  imports:[MongooseModule.forFeature([{name:"Games",schema:GamesSchema}])],
  controllers: [GamesController],
  providers: [GamesService],
  exports: [GamesService],
})
export class GamesModule {}
