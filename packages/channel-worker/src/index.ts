import {Queue, Worker} from 'bullmq';
import {Config, ChannelJob, VideoJob} from '@fy/core';
import YoutubeHelper from "./YoutubeHelper";

const {Client} = require('@elastic/elasticsearch')
const client = new Client({
    node: `http://${Config.elasticHost}:${Config.elasticPort}`
});


const videoQueue = new Queue<VideoJob>(Config.videoQueueName, {
    connection: {
        host: Config.redisHost,
        port: Config.redisPort,
        password: Config.redisPassword
    }
});

async function registerChannelInfo(channelId: string) {
    try {
        console.log('Register channel info');
        const channelInfoResult = await YoutubeHelper.getChannelInfo(channelId)
        await client.index({
            index: Config.elasticChannelIndex,
            id: channelId,
            body: {
                channel: channelInfoResult
            }
        })
    } catch (err) {
        console.error('Cannot register channel info', err);
    }
}

const worker = new Worker<ChannelJob, number>(
    Config.channelQueueName, async (job) => {
        try {
            console.log(` > Processing ${job.data.channelId}`);

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
                    console.error(`Error while fetching videoId: ${video.videoId}`, err)
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
                console.log('Find new videos for ', job.data.channelId);
                channelVideoResult.items.forEach((video) => {
                    console.log(`Post videoId: ${video.videoId}`);
                    videoQueue.add('video', {video})
                })
            } else if (videoFoundAlreadyFetched === 0) {
                // not of any new video already fetched
                // maybe never fetched channel, fetch everything to be sure
                console.log('Fetch all video for ', job.data.channelId);
                const allVideoChannel = await YoutubeHelper.loadAllChannelVideos(job.data.channelId);
                allVideoChannel.items.forEach((video) => {
                    videoQueue.add('video', {video})
                });
                await registerChannelInfo(job.data.channelId)
            }
        } catch (e) {
            console.error('something bad happened for channel ' + job.data.channelId);
            console.error(e);
            throw new Error('Cannot process ' + job.data.channelId);
        }
        return 0;
    }, {
        connection: {
            host: Config.redisHost,
            port: Config.redisPort
        }
    });

worker.on('error', err => {
    // log the error
    console.error('Cannot handle', err);
});
