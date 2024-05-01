import {Video} from "@findmytube/core";

import styles from './VideoRow.module.scss';
import Image from 'next/image'

const availableVideoWidth = {
  'XS': 168,
  'S': 196,
  'M': 246,
  'L': 336,
  'XL': 480
}

export default function VideoRow({video, onClick}: { video: Video, onClick?: (videoId: string) => void }) {

  function getThumbnail() {
    let thumbnail = video.videoThumbnails
      .find(({width}) => width === availableVideoWidth.L || width === availableVideoWidth.XL);

    if (!thumbnail) {
      thumbnail = video.videoThumbnails[0];
    }
    return thumbnail ?
      <Image src={thumbnail.url} width={availableVideoWidth.XL} height={availableVideoWidth.XL*16/9} alt="Thumbnail"/> :
      <span>Missing icon</span>
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
      <div className={styles.timer}>{video.lengthSeconds > 0 && getTimer()}</div>
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
