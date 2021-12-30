
import { Queue } from 'bullmq';

import { Config, VideoJobData } from '@fy/core';
import YoutubeHelper from './YoutubeHelper';

const queue = new Queue<VideoJobData>(Config.queueName, {
    connection: {
        host: Config.redisHost,
        port: Config.redisPort
    }
});


[
    'thinkerview',
].forEach((channelId) => {
    YoutubeHelper.loadChannelVideos(channelId)
        .then((videos) => {
            if (videos.items) {
                videos.items.forEach((video) => {
                    console.log(`Send job for ${video.videoId}`);
                    // post to queue
                    queue.add('video', { videoId: video.videoId })
                })
            } else {
                console.log('Cannot get videos for ' + channelId);
            }
        }).catch((e) => {
            console.error('Cannot get video for ', channelId);
            console.error(e);
        })
})
