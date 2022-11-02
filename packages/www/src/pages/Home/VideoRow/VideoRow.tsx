import {Transcription, Video} from "@findmytube/core";
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

  function removePreviousSentence(content: string, searchContent: string) {
    const searchIndex = content.toLowerCase().indexOf(searchContent.toLowerCase());
    const dotIndex = content.indexOf(".");
    if (dotIndex < searchIndex) {
      return content.slice(dotIndex + 1, content.length)
    }
    return content;
  }

  function clearWordsAtTheEnd(content: string) {
    const contentSplitted = content.split(".");
    if (contentSplitted.length > 1) {
      if (contentSplitted[contentSplitted.length - 1] !== "") {
        return contentSplitted.slice(0, contentSplitted.length - 1).join(".") + ".";
      }
    }
    return content;
  }

  function removeLogicalChars(content: string) {
    return content.replace("\nand", "")
  }

  function findSearchIndex(words: string[], searchContent: string) {
    let founderIndex = 0;
    const searchContentSplitted = searchContent.toLowerCase().split(" ");
    for (let wordIndex = 0; wordIndex < words.length - 1 - searchContentSplitted.length; wordIndex++) {
      if (removeLogicalChars(words[wordIndex].toLowerCase()) === searchContentSplitted[founderIndex]) {
        founderIndex++;
        if (founderIndex === searchContentSplitted.length) {
          return wordIndex - searchContentSplitted.length;
        }
      } else {
        founderIndex = 0
      }
    }
    return -1;
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

    const content = getCurrentTranscription(videoResult)
      .map((line) => line.text)
      .join(" ");
    const searchContentAmount = (
      content.match(new RegExp(searchContent, "g")) ?? []
    ).length;

    const preShift = 10;
    const postShift = 30;

    const wordsContent = content.split(" ");
    //const wordContentIndex = wordsContent.findIndex((word) => word.toLowerCase() === searchContent.toLowerCase())
    const wordContentIndex = findSearchIndex(wordsContent, searchContent)
    const subContentWords = wordsContent.slice(wordContentIndex - preShift <= 0 ? 0 : wordContentIndex - preShift,
      wordContentIndex + postShift >= wordsContent.length ? wordsContent.length - 1 : wordContentIndex + postShift);
    console.log('wordsContentIndex', wordContentIndex)
    console.log("aa" + (wordContentIndex - preShift <= 0 ? 0 : wordContentIndex - preShift), subContentWords)

    let subContent = subContentWords.join(" ");

    subContent = removePreviousSentence(subContent, searchContent);
    subContent = clearWordsAtTheEnd(subContent.charAt(0).toUpperCase() + subContent.slice(1));
    const words = subContent.split(" ");
    const wordIndex = words.findIndex((w) => w.toLowerCase() === searchContent.toLowerCase(), 0);

    return (
      <div>
        {words.slice(0, wordIndex).join(" ")}
        <em> {searchContent} </em>
        {words.slice(wordIndex + 1, words.length).join(" ")}
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
