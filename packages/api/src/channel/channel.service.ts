import { Inject, Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

import { Config, SearchChannelResult } from '@findmytube/core';
import { logger } from '@findmytube/logger';
import { Innertube, YTNodes } from 'youtubei.js';

const SEARCH_ELEMENT_PER_PAGE = 6;

@Injectable()
export class ChannelService {
  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    @Inject('INNERTUBE_SOURCE')
    private readonly innertube: Innertube,
  ) {}

  async getByAuthor(author: string) {
    try {
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
    } catch (e) {
      logger.error(`Cannot author channel ${author}`, e);
      return { hits: [] };
    }
  }

  async searchOnYoutube(content: string, page = 0) {
    const channels = await this.innertube.search(content, {
      type: 'channel',
    });

    return channels.results?.map((channel) => {
      if (channel.is(YTNodes.Channel)) {
        return {
          name: channel.short_byline.text,
          descriptionShort: channel.description_snippet.text,
          id: channel.id,
        };
      }
    });
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
