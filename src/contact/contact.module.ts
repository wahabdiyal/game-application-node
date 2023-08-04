import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactSchema } from './schemas/contact.schema';

@Module({
  imports:[MongooseModule.forFeature([{ name: 'Contact', schema:ContactSchema }])],
  controllers: [ContactController],
  providers: [ContactService],
  exports:[ContactService]
})
export class ContactModule {}
