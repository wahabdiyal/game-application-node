import { Module } from '@nestjs/common';
import { CreateLogsService } from './create-logs.service';
import { CreateLogsController } from './create-logs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateLogsSchema } from './schemas/create-logs.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'CreateLogs', schema: CreateLogsSchema }]),UserModule],
  controllers: [CreateLogsController],
  providers: [CreateLogsService],
})
export class CreateLogsModule {}
