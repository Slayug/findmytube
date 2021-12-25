
import { Queue } from "bullmq";
import { QueueName } from "./config";
import { VideoJobData } from "./VideoJob";
import YoutubeHelper from "./youtube-helper"

const queue = new Queue<VideoJobData>(QueueName, {
    connection: {
        host: "localhost",
        port: 6379
    }
});

console.log('HelloWorl');

const channelIdList = [
    'Àgauche',
    "mediapart",
    'DanyCaligula'
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
