import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactsSchema } from './schemas/contacts.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Contacts', schema: ContactsSchema }]),
  ],
  controllers: [ContactsController],
  providers: [ContactsService],
})
export class ContactsModule {}
