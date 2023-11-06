import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import mongoose from 'mongoose';
import { Contacts } from './schemas/contacts.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel(Contacts.name)
    private contactModel: mongoose.Model<Contacts>,
    ){}

  async create(createContactDto: CreateContactDto) {
    var res = await this.contactModel.create(createContactDto);
    return res;
  }

  async findAll() {
    return await this.contactModel.find().sort({ createdAt: -1 });
  }

  async findOne(id: any) {
    return await this.contactModel.findOne({_id : id});
  }

 async update(id: any, updateContactDto: UpdateContactDto) {
  const contact = await this.contactModel.findByIdAndUpdate(id,updateContactDto);

  if (!contact) {
    throw new NotFoundException('contact not found.');
  }

  return {status: true,message: "contact updated successfully"};
  }

async  remove(id: any) {
  const contact = await this.contactModel.findByIdAndDelete(id);

  if (!contact) {
    throw new NotFoundException('contact not found.');
  }

  return {status: true,message: "contact Delete successfully"};
  }
  async  findCountry(country: any) {
    const contact = await this.contactModel.findOne({ 
      country: {
      $in: [country]
    }});
  
    if (!contact) {
      throw new NotFoundException('contact not found.');
    }
  
    return {status: true,message: "contact detail",data:contact};
    }

}
