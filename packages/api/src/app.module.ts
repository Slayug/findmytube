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
import { InnertubeProvider } from './provider/youtubei';
import { CacheModule } from '@nestjs/cache-manager';
import { isNumber } from '@nestjs/common/utils/shared.utils';

@Module({
  imports: [
    CacheModule.register(),
    BullModule.forRoot({
      connection: {
        host: Config.redisHost,
        port: isNumber(Config.redisPort)
          ? Config.redisPort
          : parseInt(Config.redisPort),
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
  providers: [AppService, VideoService, ChannelService, ...InnertubeProvider],
  exports: [...InnertubeProvider],
})
export class AppModule {}
