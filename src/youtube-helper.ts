// eslint-disable-next-line @typescript-eslint/no-var-requires
const ytch = require("yt-channel-info");
import { youtube } from 'scrape-youtube';
import { SearchOptions } from 'scrape-youtube/lib/interface';

class YoutubeHelper {

    static async loadChannelVideos(
        channelId: string,
        sortBy?: "newest" | "oldest" | "popular"
    ) {
        return ytch.getChannelVideos(channelId, sortBy);
    }

    static async search(content: string, options?: SearchOptions | undefined) {
        return youtube.search(content, options);
    }
}

export default YoutubeHelper;
