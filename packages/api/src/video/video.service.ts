import Config from '@fy/core/Config';
import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

//'{"query": {
//  "query_string" : {"default_field" : "*.fullText", "query" : "*craintes*"}
//} }'

@Injectable()
export class VideoService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async search(content: string) {
    // from https://github.com/elastic/elasticsearch-js/blob/3cfc31902e9adafadcea3f9eff6dbb2a81349bb5/docs/examples/proxy/api/search.js#L56
    try {
      const response = await this.elasticsearchService.search({
        index: Config.sonarIndex,
        body: {
          query: {
            query_string: {
              default_field: '*.fullText',
              query: `*${content}*`,
            },
          },
        },
      });

      // It might be useful to configure http control caching headers
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
      // res.setHeader('stale-while-revalidate', '30')
      //res.json(response.body);
      console.log(response.body);
    } catch (err) {
      console.error(err);
    }
  }
}
