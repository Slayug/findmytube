import {Video} from '@findmytube/core';

import {youtube} from 'scrape-youtube';
import {SearchOptions} from 'scrape-youtube/lib/interface';

import {Innertube} from 'youtubei.js';
import Feed from "youtubei.js/dist/src/core/mixins/Feed";
import {IBrowseResponse} from "youtubei.js/dist/src/parser/types";


class YoutubeHelper {
    static innerTube: Innertube;

    static async innerTubeInstance() {
        if (!YoutubeHelper.innerTube) {
            YoutubeHelper.innerTube = await Innertube.create();
        }
        return YoutubeHelper.innerTube
    }

    static async getChannelInfo(channelId: string) {
        const innerTube = await YoutubeHelper.innerTubeInstance();
        return innerTube.getChannel(channelId);
    }

    static async loadLastChannelVideo(
        channelId: string,
        sortBy?: 'newest' | 'oldest' | 'popular'
    ) {
        const innerTube = await YoutubeHelper.innerTubeInstance()
        const channel  = await innerTube.getChannel(channelId)
        return channel.getVideos();
    }

    static async loadAllChannelVideos(channelId: string) {
        const innerTube = await YoutubeHelper.innerTubeInstance()
        const channel  = await innerTube.getChannel(channelId)

        const videos = await channel.getVideos()
        const allVideo = [...videos.videos];

        let continuation: Feed<IBrowseResponse> = videos;
        while (continuation.has_continuation) {
            const next = await continuation.getContinuation();
            allVideo.push(...next.videos);
            continuation = next;
        }
        console.log('>> done')
        console.log('>> length total ', allVideo.length);

        return allVideo;
    }

    static async search(content: string, options?: SearchOptions | undefined) {
        return youtube.search(content, options);
    }
}

export default YoutubeHelper;
