export interface VideoJob {
    video: Video
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

type Language = 'fr' | 'en';

export interface Translation {
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
