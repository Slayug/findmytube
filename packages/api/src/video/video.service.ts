import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { SearchVideoResult } from '@fy/core/src/Video';

@Injectable()
export class VideoService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async search(content: string): Promise<SearchVideoResult> {
    // from https://github.com/elastic/elasticsearch-js/blob/3cfc31902e9adafadcea3f9eff6dbb2a81349bb5/docs/examples/proxy/api/search.js#L56
    try {
      const response = await this.elasticsearchService.search({
        index: '',
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

      return response.body.hits;
    } catch (err) {
      console.error('Cannot get a result from elasticSearch ', err);
      throw new Error(err);
    }
  }
}
