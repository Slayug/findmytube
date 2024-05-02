import {Queue, Worker} from 'bullmq';
import {ChannelJob, Config, VideoJob} from '@findmytube/core';
import YoutubeHelper from "./YoutubeHelper";
import {logger} from "@findmytube/logger";

import {compactVideoToVideo} from "./VideoMapper";
import {YTNodes} from "youtubei.js";

const {Client} = require('@elastic/elasticsearch')
const client = new Client({
  node: `http://${Config.elasticHost}:${Config.elasticPort}`
});


const videoQueue = new Queue<VideoJob>(Config.videoQueueName, {
  connection: {
    host: Config.redisHost,
    port: Config.redisPort,
    password: Config.redisPassword
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 300000,
    },
  },
});

async function registerChannelInfo(channelId: string) {
  try {
    const channelInfoResult = await YoutubeHelper.getChannelInfo(channelId)
    if (channelInfoResult.header?.is(YTNodes.C4TabbedHeader)) {
      logger.info('Register channel', channelId)
      await client.index({
        index: Config.elasticChannelIndex,
        id: channelId,
        body: {
          channel: {
            author: channelInfoResult.header?.author.name,
            header: {
              type: channelInfoResult.header?.type,
              author: channelInfoResult.header?.author,
              thumbnail: channelInfoResult.header?.author.thumbnails
            }
          }
        }
      })
    }
  } catch (err) {
    logger.error('Cannot register channel info', err);
    throw err;
  }
}

async function channelIsRegistered(channelId: string) {
  const {body: found} = await client.exists({
    index: Config.elasticChannelIndex,
    id: channelId,
  });
  return found;
}

async function registerChannelIfNecessary(channelId: string) {
  const exists = await channelIsRegistered(channelId)
  if (!exists) {
    return await registerChannelInfo(channelId);
  }
}

const worker = new Worker<ChannelJob, number>(
  Config.channelQueueName, async (job) => {
    try {
      logger.info(`Processing: ${job.data.channelId}`);

      const [channelVideoResult] = await Promise.all([
        YoutubeHelper.loadLastChannelVideo(job.data.channelId, "newest"),
        registerChannelIfNecessary(job.data.channelId)]
      )

      // check every video is not on Elastic
      const videosFetchedStatus = await Promise.all(channelVideoResult.videos.map(async (video) => {
        if (video.is(YTNodes.Video)) {
          try {
            const {body: found} = await client.exists({
              index: Config.elasticTranscriptIndex,
              id: video.id,
            });
            return {
              found,
              videoId: video.id
            };
          } catch (err: unknown) {
            logger.error(`Error while fetching videoId: ${video.id}`, err)
            return {
              found: false,
              videoId: video.id
            }
          }
        }
      }));

      const videoFoundAlreadyFetched = videosFetchedStatus
        .map((videoStatus) => videoStatus.found)
        .filter((found) => found).length

      if (videoFoundAlreadyFetched > 0 && videoFoundAlreadyFetched < videosFetchedStatus.length) {
        // fetch new ones
        logger.info(`Find new videos for: ${job.data.channelId}`);
        channelVideoResult.videos.forEach((video) => {
          if (video.is(YTNodes.Video)) {
            videoQueue.add('video', {
              video: compactVideoToVideo(video, channelVideoResult.header)
            });
          }
        })
      } else if (videoFoundAlreadyFetched === 0) {
        // not of any new video already fetched
        // maybe never fetched channel, fetch everything to be sure
        logger.info(`Fetch all video for: ${job.data.channelId}`);
        const allVideoChannel = await YoutubeHelper.loadAllChannelVideos(job.data.channelId);
        allVideoChannel.forEach((video) => {
          if (video.is(YTNodes.Video)) {
            videoQueue.add('video', {video: compactVideoToVideo(video, channelVideoResult.header)})
          }
        });
      }
    } catch (e) {
      logger.error(`something bad happened for channel ${job.data.channelId}`, e);
      throw e;
    }
    return 0;
  }, {
    connection: {
      host: Config.redisHost,
      port: Config.redisPort,
      password: Config.redisPassword
    }
  });

worker.on('error', err => {
  // log the error
  logger.error(`Cannot handle ${err}`);
});
