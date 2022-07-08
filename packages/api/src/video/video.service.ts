import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { SearchVideoResult } from '@findmytube/core/src/Video';
import { Config } from '@findmytube/core';
import { VideoResult } from '@findmytube/core/dist/Video';

const SEARCH_ELEMENT_PER_PAGE = 9;

@Injectable()
export class VideoService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async getVideoById(videoId: string): Promise<VideoResult> {
    try {
      const response = await this.elasticsearchService.get({
        index: Config.elasticTranscriptIndex,
        id: videoId,
        _source: ['video', '*.translations'],
      });

      return response.body._source;
    } catch (err) {
      console.error(`Cannot get video by id: ${videoId}`);
      throw err;
    }
  }

  searchVideoParam(content: string, from: number, size: number) {
    return {
      index: Config.elasticTranscriptIndex,
      from,
      size,
      body: {
        query: {
          query_string: {
            default_field: '*.fullText',
            query: `"${content}"`,
          },
        },
        _source: ['video'],
      },
    };
  }

  searchVideoChannelParam(
    content: string,
    from: number,
    size: number,
    channelAuthor: string,
  ) {
    return {
      index: Config.elasticTranscriptIndex,
      from,
      size,
      body: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  default_field: '*.fullText',
                  query: `"${content}"`,
                },
              },
              {
                match: {
                  'video.author': {
                    operator: 'and',
                    query: channelAuthor,
                  },
                },
              },
            ],
          },
        },
        _source: ['video'],
      },
    };
  }

  async search(params: {
    page: number;
    content: string;
    channelAuthor?: string;
  }): Promise<SearchVideoResult> {
    // from https://github.com/elastic/elasticsearch-js/blob/3cfc31902e9adafadcea3f9eff6dbb2a81349bb5/docs/examples/proxy/api/search.js#L56
    const { page, content, channelAuthor } = params;
    const from = (page ?? 0) * SEARCH_ELEMENT_PER_PAGE;
    const size = SEARCH_ELEMENT_PER_PAGE;
    try {
      let response;
      if (channelAuthor) {
        response = await this.elasticsearchService.search(
          this.searchVideoChannelParam(content, from, size, channelAuthor),
        );
      } else {
        response = await this.elasticsearchService.search(
          this.searchVideoParam(content, from, size),
        );
      }

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
