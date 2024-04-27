import { Controller, Get } from '@nestjs/common';
import { SpotifyService } from './SpotifyService';
import { NewSong } from './entities/new-song.entity';
import { SongStorageService } from './new-songs.service';

@Controller('new-songs')
export class NewSongsController {
  constructor(
    private readonly spotifyService: SpotifyService,
    private readonly newSongsService: SongStorageService,
  ) {}

  // @Post()
  // create(@Body() createNewSongDto: CreateNewSongDto) {
  //   return 'Create new song';
  // }

  @Get('latest')
  async getLatestSongs(): Promise<NewSong> {
    return this.newSongsService.getLatestSongs();
  }

  @Get()
  findAll() {
    // return this.newSongsService.findAll();
    return this.spotifyService.getNewReleasedSongs();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.newSongsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateNewSongDto: UpdateNewSongDto) {
  //   return this.newSongsService.update(+id, updateNewSongDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.newSongsService.remove(+id);
  // }
}
