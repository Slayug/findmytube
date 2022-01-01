
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
