
export default interface VideoJobData {
    videoId: string
}


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
    type: 'video';
    videoId: string;
    videoThumbnails: Image[] | null;
    viewCount: number;
    viewCountText: string;
}
