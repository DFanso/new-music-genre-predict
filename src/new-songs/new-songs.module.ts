import { Module } from '@nestjs/common';
import { NewSongsService } from './new-songs.service';
import { NewSongsController } from './new-songs.controller';

@Module({
  controllers: [NewSongsController],
  providers: [NewSongsService],
})
export class NewSongsModule {}
