import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { VideoService } from './video.service';

@Controller('/videos')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get()
  async search(@Query('q') content: string) {
    try {
      return await this.videoService.search(content);
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Erreur lors de la recherche',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
