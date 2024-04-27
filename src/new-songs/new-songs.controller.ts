import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NewSongsService } from './new-songs.service';
import { CreateNewSongDto } from './dto/create-new-song.dto';
import { UpdateNewSongDto } from './dto/update-new-song.dto';

@Controller('new-songs')
export class NewSongsController {
  constructor(private readonly newSongsService: NewSongsService) {}

  @Post()
  create(@Body() createNewSongDto: CreateNewSongDto) {
    return this.newSongsService.create(createNewSongDto);
  }

  @Get()
  findAll() {
    return this.newSongsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newSongsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNewSongDto: UpdateNewSongDto) {
    return this.newSongsService.update(+id, updateNewSongDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newSongsService.remove(+id);
  }
}
