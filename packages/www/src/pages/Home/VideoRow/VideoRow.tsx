import {Transcription, Video} from "@findmytube/core";
import { VideoCameraOutlined } from "@ant-design/icons";

import styles from "./VideoRow.module.scss";
import { useVideoById } from "../../../hooks/useApiVideo";
import { getCurrentTranscription } from "../../../domain/Video";
import { useSearchParams } from "react-router-dom";
import { QUERY_KEY } from "../Home";
import {Fragment} from "react";

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

  function weightSearchContent(transcriptions: Transcription[], searchContent: string) {
    const words = transcriptions
      .map((line) => line.text)
      .join(" ")
      .split(" ");

    const searchContentSplitted = searchContent.toLowerCase().split(" ");
    for (let wordIndex = 0; wordIndex < words.length - searchContentSplitted.length; wordIndex++) {
      if (words[wordIndex].toLowerCase() === searchContent.toLowerCase()) {
        return <Fragment>
          { words.slice(0, wordIndex - 1).join(" ") }
          <em> { searchContent} </em>
          {words.slice(wordIndex + 1, words.length - 1).join(" ")}
        </Fragment>
      }
      if (words[wordIndex].toLowerCase() === searchContentSplitted[0]) {
        return <Fragment>
          { words.slice(0, wordIndex - 1).join(" ") }
          <em> { searchContent} </em>
          {words.slice(wordIndex + searchContentSplitted.length, words.length - 1).join(" ")}
        </Fragment>
      }
    }
    return null;
  }

  function findTranscriptionIndexOfSearch(transcriptions: Transcription[], searchContent: string) {
    const maxTranscriptionToLookForward = 4;
    for (let transcriptionIndex = 0;
      transcriptionIndex < transcriptions.length - 1 - maxTranscriptionToLookForward;
      transcriptionIndex++) {
      if (transcriptions[transcriptionIndex].text.indexOf(searchContent) !== -1) {
        return transcriptionIndex;
      }
      const fullSentence = transcriptions
        .slice(transcriptionIndex, transcriptionIndex + maxTranscriptionToLookForward)
        .join(" ");
      if (fullSentence.toLowerCase().indexOf(searchContent) !== -1) {
        return transcriptionIndex
      }
    }
    return -1;
  }

  function findFirstPart() {
    if (!videoResult) {
      return "";
    }

    const transcriptions = getCurrentTranscription(videoResult);
    const searchContentAmount = (
      transcriptions
        .map((line) => line.text)
        .join(" ")
        .match(new RegExp(searchContent, "g")) ?? []
    ).length;

    const indexOfTranscription = findTranscriptionIndexOfSearch(transcriptions, searchContent);
    const subTranscriptions = transcriptions
      .slice(indexOfTranscription - 2 <= 0 ? 0 : indexOfTranscription - 2,
        indexOfTranscription + 3 < transcriptions.length ? indexOfTranscription + 3 : transcriptions.length - 1)

    console.log("subTrans", subTranscriptions)

    return (
      <div>
        { weightSearchContent(subTranscriptions, searchContent) }
        {searchContentAmount > 1 && (
          <div className={styles.hasMore}>
            {searchContentAmount - 1} de plus
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
