import {Video} from "@findmytube/core";
import {VideoCameraOutlined} from "@ant-design/icons";

import styles from './VideoRow.module.scss';

const availableVideoWidth = {
  'XS': 168,
  'S': 196,
  'M': 246,
  'L': 336,
}

export default function VideoRow({video, onClick}: { video: Video, onClick?: (videoId: string) => void }) {

  function getThumbnail() {
    const thumbnail = video.videoThumbnails
      .find(({width}) => width === availableVideoWidth.L);

    return thumbnail ? <img src={thumbnail.url} alt="Thumbnail"/> : <VideoCameraOutlined/>;
  }

  function getTimer() {
    const secondsSplitted = (video.lengthSeconds / 60).toString().split('.');
    if (secondsSplitted.length < 2) {
      return secondsSplitted[0] + ":00";
    }
    return secondsSplitted[0] + ':' + secondsSplitted[1].concat('0').substring(0, 2);
  }

  return <div onClick={() => onClick(video.videoId)} className={styles.videoRow}>
    <div className={styles.thumbnail}>
      <div className={styles.timer}>{getTimer()}</div>
      {getThumbnail()}
    </div>
    <div className={styles.description}>
      <div className={styles.title}>{video.title}</div>
      <div className={styles.published}>{video.publishedText}</div>
      <div className={styles.authorLink}>
        <a href={`https://www.youtube.com/c/${video.authorId}`}>{video.author}</a>
      </div>
    </div>

  </div>
}
