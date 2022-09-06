import {Config, VideoJob, VideoResult} from '@findmytube/core';

import {Client} from "@elastic/elasticsearch";
import {logger} from "@findmytube/logger";
import {Queue} from "bullmq";
import {SearchResponse} from "@elastic/elasticsearch/api/types";

const client = new Client({
  node: `http://${Config.elasticHost}:${Config.elasticPort}`
});


const videoQueue = new Queue<VideoJob>(Config.videoQueueName, {
  connection: {
    host: Config.redisHost,
    port: Config.redisPort,
    password: Config.redisPassword,
  }
});

try {

  const response = await client.search<SearchResponse<VideoResult>>({
      index: Config.elasticTranscriptIndex,
      from: 0,
      size: 20,
      body: {
        query: {
          bool: {
            must_not: [
              {
                exists: {field: "fr"}
              }, {
                exists: {field: "en"}
              }, {
                exists: {field: "ko"}
              }, {
                exists: {field: "ja"}
              }, {
                exists: {field: "de"}
              }
            ]
          }
        }
      }
    }
  );

  await Promise.all(response.body.hits.hits.map((transcriptResult) => {
      logger.info(`Attempt to update : ${transcriptResult._source.video.videoId}`)
      return videoQueue.add(`video-${transcriptResult._source.video.videoId}`, {video: transcriptResult._source.video})
    }
  ));
  process.exit(0);

} catch
  (e) {
  logger.error('Cannot push a video', e);
  process.exit(1);
}
