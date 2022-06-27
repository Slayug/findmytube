import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { VideoController } from './video/video.controller';
import { VideoService } from './video/video.service';
import { Config } from ' @findmytube/core';

@Module({
  imports: [
    ElasticsearchModule.register({
      node: `http://${Config.elasticHost}:${Config.elasticPort}`,
    }),
  ],
  controllers: [AppController, VideoController],
  providers: [AppService, VideoService],
})
export class AppModule {}
