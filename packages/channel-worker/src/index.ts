import {Queue, Worker} from 'bullmq';
import {Config, ChannelJob, VideoJob} from '@findmytube/core';
import YoutubeHelper from "./YoutubeHelper";
import {logger} from "@findmytube/logger";

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
        await client.index({
            index: Config.elasticChannelIndex,
            id: channelId,
            body: {
                channel: channelInfoResult
            }
        })
    } catch (err) {
        logger.error('Cannot register channel info', err);
        throw err;
    }
}

const worker = new Worker<ChannelJob, number>(
    Config.channelQueueName, async (job) => {
        try {
            logger.info(`Processing: ${job.data.channelId}`);

            const channelVideoResult = await YoutubeHelper.loadLastChannelVideo(job.data.channelId, "newest");

            // check every video is not on Elastic
            const videosFetchedStatus = await Promise.all(channelVideoResult.items.map(async (video) => {
                try {
                    const {body: found} = await client.exists({
                        index: Config.elasticTranscriptIndex,
                        id: video.videoId,
                    });
                    return {
                        found,
                        videoId: video.videoId
                    };
                } catch (err: unknown) {
                    logger.error(`Error while fetching videoId: ${video.videoId}`, err)
                    return {
                        found: false,
                        videoId: video.videoId
                    }
                }
            }));
            const videoFoundAlreadyFetched = videosFetchedStatus
                .map((videoStatus) => videoStatus.found)
                .filter((found) => found).length

            if (videoFoundAlreadyFetched > 0 && videoFoundAlreadyFetched < videosFetchedStatus.length) {
                // fetch new ones
                logger.info(`Find new videos for: ${job.data.channelId}`);
                channelVideoResult.items.forEach((video) => {
                    logger.info(`Post videoId: ${video.videoId}`);
                    videoQueue.add('video', {video})
                })
            } else if (videoFoundAlreadyFetched === 0) {
                // not of any new video already fetched
                // maybe never fetched channel, fetch everything to be sure
                logger.info(`Fetch all video for: ${job.data.channelId}`);
                const allVideoChannel = await YoutubeHelper.loadAllChannelVideos(job.data.channelId);
                allVideoChannel.items.forEach((video) => {
                    videoQueue.add('video', {video})
                });
                await registerChannelInfo(job.data.channelId)
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
