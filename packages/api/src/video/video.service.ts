import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { SearchVideoResult } from '@fy/core/src/Video';
import { Config } from '@fy/core';
import { VideoResult } from '@fy/core/dist/Video';

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

  async search(content: string, page = 0): Promise<SearchVideoResult> {
    // from https://github.com/elastic/elasticsearch-js/blob/3cfc31902e9adafadcea3f9eff6dbb2a81349bb5/docs/examples/proxy/api/search.js#L56
    const from = page * SEARCH_ELEMENT_PER_PAGE;
    const size = SEARCH_ELEMENT_PER_PAGE;
    try {
      const response = await this.elasticsearchService.search({
        index: Config.elasticTranscriptIndex,
        from,
        size,
        body: {
          query: {
            query_string: {
              default_field: '*.fullText',
              query: `*${content}*`,
            },
          },
          _source: ['video'],
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
