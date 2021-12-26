
import { Queue } from "bullmq";
import Config from "@fy/core/Config";
import VideoJobData from "@fy/core/VideoJobData";
import YoutubeHelper from "@fy/core/YoutubeHelper";

const queue = new Queue<VideoJobData>(Config.queueName, {
    connection: {
        host: Config.redisHost,
        port: Config.redisPort
    }
});

console.log('HelloWorl');

const channelIdList = [
    'cliquecanal',
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
