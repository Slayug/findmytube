import { Controller, Get, Query } from '@nestjs/common';
import { VideoService } from './video.service';

@Controller('/videos')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get()
  search(@Query('q') content) {
    console.log('content', content);
    this.videoService.search(content);
  }
}
