import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

import ytsr from 'ytsr';
import { Config } from '@findmytube/core';

const SEARCH_ELEMENT_PER_PAGE = 6;

@Injectable()
export class ChannelService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async searchOnYoutube(content: string, page = 0) {
    const queryFilter = await ytsr.getFilters(content);
    const channelFilter = queryFilter.get('Type').get('Channel');
    const options = { pages: page };

    return await ytsr(channelFilter.url, options);
  }

  async searchOnElastic(content: string, page = 0) {
    const from = page * SEARCH_ELEMENT_PER_PAGE;
    const size = SEARCH_ELEMENT_PER_PAGE;
    try {
      const response = await this.elasticsearchService.search({
        index: Config.elasticChannelIndex,
        from,
        size,
        body: {
          query: {
            query_string: {
              default_field: 'channel.author',
              query: `${content}*`,
            },
          },
          _source: {
            excludes: [
              'authorBanners',
              'authorThumbnails',
              'allowedRegions',
              'description',
            ],
          },
        },
      });


      return {
        took: response.body.took,
        page,
        ...response.body.hits,
      };
    } catch (err) {
      console.error('Cannot get a result from elasticSearch ', err);
      throw new Error(err);
    }
  }
}
