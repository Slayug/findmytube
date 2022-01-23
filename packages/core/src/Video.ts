export interface VideoJob {
    video: Video
}

export interface ChannelJob {
    channelId: string
}

export interface ChannelInfo {
    author: string,
    authorId: string,
    authorUrl: string,
    /**
     * Will return null if none exist
     */
    authorBanners: any[],
    /**
     * Will return null if none exist
     */
    authorThumbnails: {
        url: string,
        width: number,
        height: number
    }[],
    subscriberText: string,
    subscriberCount: number,
    description: string,
    isFamilyFriendly: boolean,
    relatedChannels: {
        items: any[],
        /**
         * Will return null if there are 12 or fewer related channels.  Used with getRelatedChannelsMore()
         */
        continuation: string
    },
    allowedRegions: string[],
    isVerified: boolean,
    channelIdType: number,
}

/**
 * An Image which represents all banners and thumbnails
 */
export interface Image {
    url: string;
    height: number;
    width: number;
}

export interface Video {
    author: string;
    authorId: string;
    durationText: string;
    lengthSeconds: number;
    liveNow: boolean;
    premiere: boolean;
    publishedText: string;
    title: string;
    type: 'video';
    videoId: string;
    videoThumbnails: Image[] | null;
    viewCount: number;
    viewCountText: string;
}

export const LanguageList = ['fr', 'en', 'es'] as const;
export type Language = typeof LanguageList[number];

export interface Transcription {
    text: string,
    start: number,
    duration: number
}

export type Languages = { [key in Language]?: { translations: string } }

export type VideoResult = {
    video?: Video,
} & Languages;

export interface SearchVideoResult {
    tool: number;
    timed_out: boolean;
    page: number,
    took: number,
    _shards: {
        total: number;
        successful: number;
        skipped: number;
        failed: number;
    };
    total: {
        value: number
    }
    hits: {
        _index: "transcript",
        _id: string,
        _score: number,
        _source: {
            video: Video
        }
    }[]
}
