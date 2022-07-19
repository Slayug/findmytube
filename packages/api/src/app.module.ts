import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { VideoController } from './video/video.controller';
import { VideoService } from './video/video.service';
import { Config } from '@findmytube/core';
import { ChannelController } from './channel/channel.controller';
import { ChannelService } from './channel/channel.service';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: Config.redisPort,
        password: Config.redisPassword,
      },
    }),
    BullModule.registerQueue({
      name: Config.channelQueueName,
    }),
    ElasticsearchModule.register({
      node: `http://${Config.elasticHost}:${Config.elasticPort}`,
    }),
  ],
  controllers: [AppController, VideoController, ChannelController],
  providers: [AppService, VideoService, ChannelService],
})
export class AppModule {}
