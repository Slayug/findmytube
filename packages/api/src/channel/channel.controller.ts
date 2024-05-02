import {
  Controller,
  Get,
  HttpException,
  HttpStatus, Param,
  ParseIntPipe,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Queue } from 'bullmq';
import {ChannelQueueInfo, Config, VideoJob} from '@findmytube/core';

@Controller('/channels')
@UseInterceptors(CacheInterceptor)
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Get(':channelName/queue')
  async channelQueue(
    @Param() { channelName }: { channelName: string },
  ): Promise<ChannelQueueInfo> {
    const myQueue = new Queue<VideoJob>(Config.videoQueueName);

    const jobs = await myQueue.getJobs([
      'active',
      'wait',
      'delayed',
      'waiting-children',
    ]);

    const jobsFiltered =
      jobs.filter(
        (job) => job.data?.video?.author?.trim() === channelName?.trim(),
      ) ?? [];

    return {
      inProgress: jobsFiltered.length,
      queueName: Config.videoQueueName,
      channelId: jobsFiltered[0]?.data.video.authorId,
      channelName: jobsFiltered[0]?.data.video.author ?? '',
    };
  }

  @Get('/youtube')
  async searchOnYoutube(
    @Query('q') content: string,
    @Query('page', ParseIntPipe) page = 0,
  ) {
    try {
      return await this.channelService.searchOnYoutube(content, page);
    } catch (e) {
      console.error('Cannot recover youbtube channel', e);

      // attempt to return only scrapped channels
      return this.search(content, page);
    }
  }

  @Get()
  async search(
    @Query('q') content: string,
    @Query('page', ParseIntPipe) page = 0,
  ) {
    if (page < 0) {
      throw new HttpException('Page must be >= 0', HttpStatus.BAD_REQUEST);
    }
    if (content && content.indexOf('\\') !== -1) {
      throw new HttpException('Invalid character', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.channelService.searchOnElastic(content, page);
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Erreur lors de la recherche',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
