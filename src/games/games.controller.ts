import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from './../config/storage.config';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) { }

  @Post()
  // @UseInterceptors(FileInterceptor('file'))
  @UseInterceptors(
    FileInterceptor(
      "file", // name of the field being passed
      { storage }
    )
  )
  //////add  path file save and folder location/////
  async create(@UploadedFile() file: Express.Multer.File, @Body() createGameDto: CreateGameDto) {
    let filecustom = file.path.replace("public\\", "");
    const remove = filecustom.replace("\\", "/");
    return await this.gamesService.create({ ...createGameDto, file_url: remove.replace("public/", "") });
  }
  @Get('/mobile')
 async findAllForMobile() {
    return await this.gamesService.findAllMobile();
  }
  @Get()
  findAll() {
    return this.gamesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gamesService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor(
      "file", // name of the field being passed
      { storage }
    )
  )
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateGameDto: UpdateGameDto
  ) {
    // You can implement your logic here, e.g., finding the existing game by id and updating it
    // Then, you can update the file_url property similar to how you did in the create method

    const updatedGame = await this.gamesService.update(id, {
      ...updateGameDto,
      file_url: file ? (file.path.replace("public\\", "")).replace("\\", "/") : undefined
    });

    return updatedGame;
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gamesService.remove(id);
  }

  @Get('/active-game/all-count')
  getActiveGamesCount() {
    return this.gamesService.getActiveGamesCount();
    // return "Allah hu";
  }




 
}
