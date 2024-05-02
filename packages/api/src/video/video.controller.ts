import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { ChannelService } from '../channel/channel.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Config } from '@findmytube/core';
import { Queue } from 'bullmq';

@Controller('/videos')
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private readonly channelService: ChannelService,
    @InjectQueue(Config.channelQueueName) private readonly channelQueue: Queue,
  ) {}

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
        try {
          await this.channelQueue.add(
            `channel-${youtubeChannel[0]?.id}`,
            {
              channelId: channelId,
            },
            { jobId: channelId },
          );
        } catch (err) {
          if (err.message.includes('Job is already waiting')) {
            console.log(`Channel ${channelAuthor} already exists, ignore it`);
          } else {
            console.error(err);
          }
        }
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
