import { Module } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { ChallengesController } from './challenges.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ChallengesSchema } from './schemas/challenges.schema';
import { GamesService } from 'src/games/games.service';
import { GamesSchema } from 'src/games/schemas/games.schema';
import { UserSchema } from 'src/user/schemas/user.schema';

@Module({
  imports:[MongooseModule.forFeature([
    {name: 'Challenges',schema:ChallengesSchema},
    {name: 'Games',schema:GamesSchema},
    {name: 'User',schema:UserSchema},
  ])],
  controllers: [ChallengesController],
  providers: [ChallengesService],
  exports: [ChallengesService],
})
export class ChallengesModule {}
