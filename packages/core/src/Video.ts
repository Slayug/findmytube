import { Channel } from 'youtubei.js/dist/src/parser/youtube';


export interface VideoJob {
    video: Video
}

export interface ChannelJob {
    channelId: string
}

export type ChannelInfo = Channel

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

type Result = {
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
}

export type SearchChannelResult = {
    hits: {
        _index: 'channel',
        _id: string,
        _score: number,
        _source: {
            channel: ChannelInfo
        }
    }[]
}

export type SearchChannelYoutubeResult = {
    name: string,
    descriptionShort: string,
    channelID: string
}

export type SearchVideoResult = {
    hits: {
        _index: 'transcript',
        _id: string,
        _score: number,
        _source: {
            video: Video
        }
    }[]
} & Result;
