import { Module } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { ChallengesController } from './challenges.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ChallengesSchema } from './schemas/challenges.schema';

@Module({
  imports:[MongooseModule.forFeature([{name: 'Challenges',schema:ChallengesSchema}])],
  controllers: [ChallengesController],
  providers: [ChallengesService],
  exports: [ChallengesService],
})
export class ChallengesModule {}
