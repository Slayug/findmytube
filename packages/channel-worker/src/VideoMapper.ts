import {Video as CoreVideo} from "@findmytube/core";
import {Video, C4TabbedHeader, CarouselHeader, InteractiveTabbedHeader, PageHeader} from "youtubei.js/dist/src/parser/nodes";
import {YTNodes} from "youtubei.js";
import {logger} from "@findmytube/logger";


export function compactVideoToVideo(compactVideo: Video, header: C4TabbedHeader | CarouselHeader | InteractiveTabbedHeader | PageHeader): CoreVideo{
  let author = compactVideo.author;
  if (author.name === 'N/A' && header.is(YTNodes.C4TabbedHeader)) {
    author = header.author;
  }
  if (author.name === 'N/1') {
    logger.warn('Cannot get correct author for: ', compactVideo.id)
  }
  return {
    author: author.name,
    authorId: author.id,
    durationText: compactVideo.duration.text,
    title: compactVideo.title.text,
    viewCount: parseInt(compactVideo.view_count.text ?? "0"),
    viewCountText: compactVideo.view_count.text,
    lengthSeconds: compactVideo.duration.seconds,
    liveNow: compactVideo.is_live,
    publishedText: compactVideo.published.text,
    videoId: compactVideo.id,
    premiere: compactVideo.is_premiere,
    type: 'video',
    videoThumbnails: compactVideo.thumbnails.map((thumbnail) => ({
      url: thumbnail.url,
      height: thumbnail.height,
      width: thumbnail.width
    }))
  }
}
