/* eslint-disable no-console */
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { CreateNewSongDto } from './dto/create-new-song.dto';
import { ConfigService } from '@nestjs/config';
import { YtService } from './ytService';
import { DownloadService } from './downloadService';
import { GenreService } from './genreService';
import { SongStorageService } from './new-songs.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class SpotifyService {
  private readonly spotifyApiUrl =
    this.configService.get<string>('SPOTIFY_API_URL');

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly ytService: YtService,
    private readonly downloadService: DownloadService,
    private readonly genreService: GenreService,
    private readonly songService: SongStorageService,
  ) {}

  async getAccessToken(): Promise<string> {
    const clientId = this.configService.get<string>('SPOTIFY_CLIENT_ID');
    const clientSecret = this.configService.get<string>(
      'SPOTIFY_CLIENT_SECRET',
    );
    const { data } = await lastValueFrom(
      this.httpService.post('https://accounts.spotify.com/api/token', null, {
        params: {
          grant_type: 'client_credentials',
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        },
      }),
    );
    return data.access_token;
  }

  @Cron('0 0 * * 5')
  async handleCron() {
    const newSongsDto = await this.getNewReleasedSongs();
    console.log(newSongsDto);
  }

  async getNewReleasedSongs(): Promise<CreateNewSongDto> {
    const playlistId = this.configService.get<string>('PLAYLIST_ID');
    const limit = 10; // Change this to the desired number of songs
    const accessToken = await this.getAccessToken();
    const { data } = await lastValueFrom(
      this.httpService.get(
        `${this.spotifyApiUrl}/playlists/${playlistId}/tracks`,
        {
          params: {
            limit,
            fields: 'items(track(name))',
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ),
    );
    const songNames = data.items.map((item) => item.track.name);
    const songsWithM4aLink = await Promise.all(
      songNames.map(async (name) => {
        const m4aLink = await this.ytService.getM4aLink(name);
        return { name, ytLink: m4aLink };
      }),
    );
    const songsWithWavFilePath = await Promise.all(
      songsWithM4aLink.map(async (song) => {
        const wavFilePath = await this.downloadService.downloadAndConvertToWav(
          song.name,
          song.ytLink,
        );
        return { ...song, wavFilePath };
      }),
    );
    const newSongDto: CreateNewSongDto = {
      songs: songsWithWavFilePath,
      date: new Date(),
    };

    // Get the predicted genres for the songs
    const songsWithGenre =
      await this.genreService.getGenresForSongs(newSongDto);

    return await this.songService.saveSongs(songsWithGenre);
  }
}
