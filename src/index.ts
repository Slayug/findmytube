import { BarOrchestrator } from "./orchestrator"
import YoutubeHelper from "./youtube-helper"

const orchestrator = new BarOrchestrator();
const channelIdList = [
    'UCL_cZf5sHKQHMRIEax5o3sg',
    //'FRANCE24',
    //'Europe1'
].forEach((channelId) => {
    YoutubeHelper.loadChannelVideos(channelId)
        .then((videos) => {
            if (videos.items) {
                videos.items.forEach((video) => {
                    console.log(`Getting video transcript ${video.videoId}`);
                    orchestrator.startGettingTranscript(video.videoId);
                })
            } else {
                console.log('Cannot get videos for ' + channelId);
            }
        })
})
