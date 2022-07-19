import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ChannelService } from './channel.service';

@Controller('/channels')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

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
