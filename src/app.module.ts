import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { NewSongsModule } from './new-songs/new-songs.module';

mongoose.set('debug', (collectionName, methodName, ...methodArgs) => {
  Logger.verbose(
    `${collectionName}.${methodName}(${JSON.stringify(methodArgs)})`,
    'Mongoose',
  );
});

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validationSchema: Joi.object({
        MONGO_URI: Joi.string().required(),
      }),
    }),
    MongooseModule.forRoot(
      process.env.MONGO_URI as string,
      {
        autoIndex: true,
        autoCreate: true,
      } as MongooseModuleOptions,
    ),
    ScheduleModule.forRoot(),
    NewSongsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
