import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from './schemas/contact.schema';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(Contact.name)
    private contactModel: mongoose.Model<Contact>,
  ) {}

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    return await this.contactModel.create(createContactDto);
  }

  async findAll(): Promise<Contact[]> {
    return await this.contactModel.find();
  }

  async findOne(id: any): Promise<Contact> {
    return await this.contactModel.findById(id);
  }

  async update(id: number, updateContactDto: UpdateContactDto) {
    const contact = await this.contactModel.findByIdAndUpdate(
      id,
      updateContactDto,
    );
    if (!contact) {
      throw new NotFoundException('contact not found.');
    }

    return { status: true, message: 'contact updated successfully' };
  }

  async remove(id: number) {
    const contact = await this.contactModel.findByIdAndDelete(id);

    if (!contact) {
      throw new NotFoundException('contact Coin  not found.');
    }

    return { status: true, message: 'contact Coin Delete successfully' };
  }
}
