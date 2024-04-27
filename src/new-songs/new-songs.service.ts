import { Injectable } from '@nestjs/common';
import { CreateNewSongDto } from './dto/create-new-song.dto';
import { UpdateNewSongDto } from './dto/update-new-song.dto';

@Injectable()
export class NewSongsService {
  create(createNewSongDto: CreateNewSongDto) {
    return 'This action adds a new newSong';
  }

  findAll() {
    return `This action returns all newSongs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} newSong`;
  }

  update(id: number, updateNewSongDto: UpdateNewSongDto) {
    return `This action updates a #${id} newSong`;
  }

  remove(id: number) {
    return `This action removes a #${id} newSong`;
  }
}
