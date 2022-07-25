import {Config} from "@findmytube/core";
import YoutubeHelper from "@findmytube/channel-worker/src/YoutubeHelper";

const {Client} = require('@elastic/elasticsearch')
const client = new Client({
    node: `http://${Config.elasticHost}:${Config.elasticPort}`
});

const channelVideoResult = await YoutubeHelper.loadLastChannelVideo("UCe6iUNw4s5VxGnWi63JRU3g", "newest");

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
