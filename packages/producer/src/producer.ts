import {Queue} from 'bullmq';

import {Config, VideoJob} from '@fy/core';
import YoutubeHelper from './YoutubeHelper';

const queue = new Queue<VideoJob>(Config.queueName, {
    connection: {
        host: Config.redisHost,
        port: Config.redisPort
    }
});


[
    'LEBONSENS',
].forEach((channelId) => {
    YoutubeHelper.loadChannelVideos(channelId)
        .then((videos) => {
            if (videos.items) {
                videos.items.forEach((video) => {
                    console.log(`Send job for ${video.videoId}`);
                    // post to queue
                    queue.add('video', {video})
                })
            } else {
                console.log('Cannot get videos for ' + channelId);
            }
        })
        .catch((e) => {
            console.error('Cannot get video for ', channelId);
            console.error(e);
        })
})
