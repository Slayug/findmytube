import { Video } from "@findmytube/core";
import { VideoCameraOutlined } from "@ant-design/icons";

import styles from "./VideoRow.module.scss";
import { useVideoById } from "../../../hooks/useApiVideo";
import { getCurrentTranscription } from "../../../domain/Video";
import { useSearchParams } from "react-router-dom";
import { QUERY_KEY } from "../Home";

const availableVideoWidth = {
  XS: 168,
  S: 196,
  M: 246,
  L: 336,
  XL: 480,
};

export default function VideoRow({
  video,
  onClick,
}: {
  video: Video;
  onClick?: (videoId: string) => void;
}) {
  const [searchParams] = useSearchParams();
  const searchContent = searchParams.get(QUERY_KEY);
  const { data: videoResult } = useVideoById(video.videoId);

  function getThumbnail() {
    let thumbnail = video.videoThumbnails.find(
      ({ width }) =>
        width === availableVideoWidth.L || width === availableVideoWidth.XL
    );

    if (!thumbnail) {
      thumbnail = video.videoThumbnails[0];
    }
    return thumbnail ? (
      <img src={thumbnail.url} alt="Thumbnail" />
    ) : (
      <VideoCameraOutlined />
    );
  }

  function getTimer() {
    const secondsSplitted = (video.lengthSeconds / 60).toString().split(".");
    if (secondsSplitted.length < 2) {
      return secondsSplitted[0] + ":00";
    }
    return (
      secondsSplitted[0] + ":" + secondsSplitted[1].concat("0").substring(0, 2)
    );
  }

  function findFirstPart() {
    if (!videoResult) {
      return "";
    }

    const content = getCurrentTranscription(videoResult)
      .map((line) => line.text)
      .join(" ");
    const searchContentAmount = (
      content.match(new RegExp(searchContent, "g")) ?? []
    ).length;

    const index = content.indexOf(searchContent);

    const shift = 100;

    const subContent = content.substring(
      index > shift ? index - shift : index,
      index + shift
    );
    const words = subContent.split(" ");
    const wordIndex = words.indexOf(searchContent, 0);

    return (
      <div>
        {words.slice(1, wordIndex - 1).join(" ")}
        <span className={styles.mark}> {searchContent} </span>
        {words.slice(wordIndex + 1, words.length).join(" ")}
        {searchContentAmount > 1 && (
          <div className={styles.hasMore}>
            Has {searchContentAmount - 1} more
          </div>
        )}
      </div>
    );
  }

  return (
    <div onClick={() => onClick(video.videoId)} className={styles.videoRow}>
      <div className={styles.content}>
        <div className={styles.thumbnail}>
          <div className={styles.timer}>
            {video.lengthSeconds > 0 && getTimer()}
          </div>
          {getThumbnail()}
        </div>
        <div className={styles.description}>
          <div>
            <div className={styles.title}>{video.title}</div>
            <div className={styles.published}>{video.publishedText}</div>
            <div className={styles.authorLink}>
              <a href={`https://www.youtube.com/c/${video.authorId}`}>
                {video.author}
              </a>
            </div>
          </div>
          <div className={styles.subContent}>{findFirstPart()}</div>
        </div>
      </div>
    </div>
  );
}
