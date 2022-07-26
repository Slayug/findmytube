import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

import { Config } from '@findmytube/core';
import * as ytsr from 'ytsr';
import { Channel } from 'ytsr';
import { SearchChannelResult } from '@findmytube/core/dist/Video';

const SEARCH_ELEMENT_PER_PAGE = 6;

@Injectable()
export class ChannelService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async getByAuthor(author: string) {
    const result = await this.elasticsearchService.search({
      index: Config.elasticChannelIndex,
      body: {
        query: {
          match: {
            'channel.author': {
              query: author,
              operator: 'and',
            },
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
    return result.body.hits as SearchChannelResult;
  }

  async searchOnYoutube(content: string, page = 0) {
    const queryFilter = await ytsr.getFilters(content);
    const channelFilter = queryFilter.get('Type').get('Channel');
    const options = { pages: page };

    const result = await ytsr(channelFilter.url, options);
    return result.items.map((item: Channel) => ({
      name: item.name,
      descriptionShort: item.descriptionShort,
      channelID: item.channelID,
    }));
  }

  async searchOnElastic(content: string, page = 0) {
    const from = page * SEARCH_ELEMENT_PER_PAGE;
    const size = SEARCH_ELEMENT_PER_PAGE;

    try {
      const elasticResponse = await this.elasticsearchService.search({
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
        took: elasticResponse.body.took,
        page,
        ...elasticResponse.body.hits,
      };
    } catch (err) {
      console.error('Cannot get a result from elasticSearch ', err);
      throw new Error(err);
    }
  }
}
