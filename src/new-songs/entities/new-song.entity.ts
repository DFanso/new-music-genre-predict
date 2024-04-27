import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NewSongDocument = NewSong & Document;

class Song {
  @Prop({ required: true })
  name: string;

  @Prop()
  ytLink?: string;

  @Prop()
  wavFilePath?: string;

  @Prop()
  genre?: string;
}

@Schema()
export class NewSong {
  @Prop({ type: [Song] })
  songs: Song[];

  @Prop()
  date?: Date;
}

export const NewSongSchema = SchemaFactory.createForClass(NewSong);
