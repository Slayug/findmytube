import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { ChannelService } from '../channel/channel.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Config } from '@findmytube/core';
import { Queue } from 'bullmq';
import { Innertube, YTNodes } from 'youtubei.js';

@Controller('/videos')
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private readonly channelService: ChannelService,
    @InjectQueue(Config.channelQueueName) private readonly channelQueue: Queue,
    @Inject('INNERTUBE_SOURCE')
    private readonly innertube: Innertube,
  ) {}

  @Get('/trend')
  async getTrend() {
    const trend = await this.innertube.getTrending();

    console.log('trrend', trend.videos.length);
    trend.videos
      .map((video) => {
        if (video.is(YTNodes.Video)) {
          return video.author.id;
        }
        return undefined;
      })
      .map(async (channelId) => {
        if (channelId) {
          return this.channelQueue.add(`channel-${channelId}`, {
            channelId,
          });
        }
      });
    return [];
  }

  @Get(':videoId')
  async getById(@Param() { videoId }) {
    try {
      return await this.videoService.getVideoById(videoId);
    } catch (err) {
      if (err.statusCode === 404) {
        throw new HttpException(`Not found ${videoId}`, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Erreur lors de la recherche de la video',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async search(
    @Query('q') content: string,
    @Query('page', ParseIntPipe) page = 0,
    @Query('channelAuthor') channelAuthor: string,
  ) {
    if (page < 0) {
      throw new HttpException('Page must be >= 0', HttpStatus.BAD_REQUEST);
    }

    if (channelAuthor) {
      const existingAuthors = await this.channelService.getByAuthor(
        channelAuthor,
      );

      if (existingAuthors?.hits.length === 0) {
        const youtubeChannel = await this.channelService.searchOnYoutube(
          channelAuthor,
        );
        const channelId = youtubeChannel[0]?.id;
        await this.channelQueue.add(`channel-${youtubeChannel[0]?.id}`, {
          channelId: channelId,
        });
        throw new HttpException('Channel not found', HttpStatus.NOT_FOUND);
      }
    }

    try {
      return await this.videoService.search({ content, page, channelAuthor });
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Erreur lors de la recherche',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
