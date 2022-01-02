
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

export interface SearchVideoResult {
    tool: number;
    timed_out: boolean;
    _shards: {
        total: number;
        successful: number;
        skipped: number;
        failed: number;
    };
    hits: {
        _index: "transcript",
        _id: string,
        _score: number,
        _source: {
            video: Video
        }
    }[]
}
