interface Song {
  name: string;
  ytLink?: string;
  wavFilePath?: string;
  genre?: string;
}

export class CreateNewSongDto {
  songs: Song[];
  date?: Date;
}
