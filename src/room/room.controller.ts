import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { MongoClient } from 'mongodb';

@Controller('room')
export class RoomController {
  private client: MongoClient;
  private dbName = 'game-application';
  constructor(private readonly roomService: RoomService) {
    // this.client = new MongoClient('mongodb://localhost:27017');
    // this.client.connect();
  }

  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }


  @Get(':collectionName')
  async getAllDocuments(@Param('collectionName') collectionName: string) {
    const app_id = 'ec3b1b5e-633b-42f0-969f-21b1f11ad033'


    const db = this.client.db(this.dbName);
    const collection = db.collection(collectionName);
    const documents = await collection.find({});
    return documents;
  }
  @Get()
  findAll() {
    return this.roomService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.roomService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.update(+id, updateRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomService.remove(+id);
  }
}
