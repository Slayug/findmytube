// eslint-disable-next-line @typescript-eslint/no-var-requires
const ytch = require("yt-channel-info");
import { youtube } from 'scrape-youtube';
import { SearchOptions } from 'scrape-youtube/lib/interface';
/**
    * An Image which represents all banners and thumbnails
    */
interface Image {
    url: string;
    height: number;
    width: number;
}
interface Video {
    author: string;
    authorId: string;
    durationText: string;
    lengthSeconds: number;
    liveNow: boolean;
    premiere: boolean;
    publishedText: string;
    title: string;
    type: "video";
    videoId: string;
    videoThumbnails: Image[] | null;
    viewCount: number;
    viewCountText: string;
}


class YoutubeHelper {

    static async loadChannelVideos(
        channelId: string,
        sortBy?: "newest" | "oldest" | "popular"
    ): Promise<{ items: Video[] }> {
        return ytch.getChannelVideos(channelId, sortBy);
    }

    static async search(content: string, options?: SearchOptions | undefined) {
        return youtube.search(content, options);
    }
}

export default YoutubeHelper;
