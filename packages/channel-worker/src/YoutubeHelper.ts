import {Video} from '@findmytube/core';

import {youtube} from 'scrape-youtube';
import {SearchOptions} from 'scrape-youtube/lib/interface';

import {Innertube} from 'youtubei.js';


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

    static async loadAllChannelVideos(
        channelId: string,
        items?: Video[],
        continuation?: string
    ) {
        return this.loadLastChannelVideo(channelId)
       /* if (continuation) {
            const result = await ytch.getChannelVideosMore(continuation)
            if (result.continuation) {
                const deepResult = await YoutubeHelper.loadAllChannelVideos(channelId, result.items, result.continuation);
                const currentItems = deepResult ? deepResult.items : []
                return {
                    items: [
                        ...items,
                        ...currentItems
                    ]
                }
            }
        } else {
            const result = await ytch.getChannelVideos(channelId, 'newest');
            if (result.continuation) {
                const deepResult = await YoutubeHelper.loadAllChannelVideos(channelId, result.items, result.continuation)
                if (!deepResult) {
                    return {
                        items: [ ...result.items ]
                    }
                }
                return {
                    items: [
                        ...result.items,
                        ...deepResult.items
                    ]
                }
            } else {
                return {
                    items: result.items
                }
            }
        }*/
    }

    static async search(content: string, options?: SearchOptions | undefined) {
        return youtube.search(content, options);
    }
}

export default YoutubeHelper;
