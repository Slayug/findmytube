import {Video, ChannelInfo} from '@findmytube/core';

const ytch = require('yt-channel-info');
import { youtube } from 'scrape-youtube';
import { SearchOptions } from 'scrape-youtube/lib/interface';


class YoutubeHelper {

    static async getChannelInfo(channelId: string): Promise<ChannelInfo> {
        return ytch.getChannelInfo(channelId)
    }

    static async loadLastChannelVideo(
        channelId: string,
        sortBy?: 'newest' | 'oldest' | 'popular'
    ): Promise<{ items: Video[] }> {
        return ytch.getChannelVideos(channelId, sortBy);
    }

    static async loadAllChannelVideos(
        channelId: string,
        items?: Video[],
        continuation?: string
    ): Promise<{ items: Video[] }> {
        if (continuation) {
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
        }
    }

    static async search(content: string, options?: SearchOptions | undefined) {
        return youtube.search(content, options);
    }
}

export default YoutubeHelper;
