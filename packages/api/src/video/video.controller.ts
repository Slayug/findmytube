import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { VideoService } from './video.service';

@Controller('/videos')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get()
  async search(@Query('q') content: string, @Query('page', ParseIntPipe) page = 0) {
    if (page < 0) {
      throw new HttpException('Page must be >= 0', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.videoService.search(content, page);
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Erreur lors de la recherche',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
