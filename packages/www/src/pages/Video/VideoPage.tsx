import {Fragment, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useSearchParams} from "react-router-dom";
import useApiVideo from "../../hooks/useApiVideo";
import {useQuery} from "react-query";
import {Alert, Col, Row, Spin} from "antd";
import ReactPlayer from "react-player";

import styles from "./VideoPage.module.scss";
import {LanguageList, Transcription} from "@fy/core/dist";
import {findAllIndexOfQuery, markWordsFrom} from "./VideoPageDomain";

const QUERY_KEY = "q";

function Inline(
  {transcription, line, onSeek}: { transcription: Transcription, line: JSX.Element, onSeek: (time: number) => void }
) {

  console.log('render Inline');

  const ms = transcription.start * 1000;
  const hours = `0${new Date(ms).getHours() - 1}`.slice(-2);
  const minutes = `0${new Date(ms).getMinutes()}`.slice(-2);
  const seconds = `0${new Date(ms).getSeconds()}`.slice(-2);

  return <span className={styles.line}>
    <span
      onClick={() => onSeek(transcription.start)}
      className={styles.time}>
      {hours && `${hours}:`}{minutes && `${minutes}:`}{seconds ? `${seconds}` : `00`}: </span>
    {line}
  </span>

}

const SHIFT_BETWEEN_LINE = ' ';

type ParsedLine = { transcription: Transcription, jsx: JSX.Element };

function TranscriptionList(
  {onSeek, transcriptions, query}: { onSeek: (time: number) => void, transcriptions: Transcription[], query: string }
) {
  console.log('renderTranscriptionList');

  // create global memo
  const lines = useMemo(() => {
    const fullText = transcriptions.map((transcription) => transcription.text)
      .reduce(((previousValue, currentValue) => `${previousValue} ${currentValue}`), "")
    const transcriptionsMapped = transcriptions.map((tr) => {
      return {start: tr.start, duration: tr.duration, text: tr.text + SHIFT_BETWEEN_LINE}
    });

    const startIndexes = findAllIndexOfQuery(fullText, query);
    const parsedLines: ParsedLine[] = [];

    let charCount = 0;
    let untilNextLine = false;
    let charsRemaining = 0;

    for (const transcription of transcriptionsMapped) {
      let lineAdded = false;
      if (untilNextLine) {
        parsedLines.push({
          transcription, jsx: <Inline onSeek={onSeek} transcription={transcription} line={
            markWordsFrom(
              transcription,
              0,
              charsRemaining
            )}/>
        });
        lineAdded = true;
        if (charsRemaining <= transcription.text.length) {
          untilNextLine = false;
          charsRemaining = 0;
          startIndexes.shift();
        }
      } else if (startIndexes.length > 0) {
        const startIndex = startIndexes[0];
        const relativeStartIndex = startIndex - charCount - SHIFT_BETWEEN_LINE.length;

        if (startIndex > charCount && startIndex < charCount + transcription.text.length) {
          parsedLines.push({
            transcription,
            jsx: <Inline
              onSeek={onSeek}
              transcription={transcription}
              line={
                markWordsFrom(
                  transcription,
                  relativeStartIndex, relativeStartIndex + query.length)
              }/>
          });

          if (startIndex + query.length > charCount + transcription.text.length) {
            untilNextLine = true;
            charsRemaining = query.length - (transcription.text.length - relativeStartIndex);
          } else {
            startIndexes.shift();
          }
          lineAdded = true;
        }

      }
      if (!lineAdded) {
        parsedLines.push({
          transcription,
          jsx: <Inline
            onSeek={onSeek}
            transcription={transcription}
            line={<Fragment>{transcription.text}</Fragment>}
          />
        })
      }
      charCount += transcription.text.length
    }

    return parsedLines;

  }, [transcriptions.length, query])

  return <div className={styles.lines}>
    {
      lines.map((currentLine) => {
        return <Fragment key={currentLine.transcription.start}>{currentLine.jsx}</Fragment>
      })
    }
  </div>
}

export default function VideoPage() {
  const [componentError, setComponentError] = useState<string | undefined>(
    undefined
  );
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get("v") ?? "";
  const youtubeRef = useRef<ReactPlayer>();

  const {getVideoById} = useApiVideo();

  const {
    data: videoResult,
    error,
    isLoading,
  } = useQuery("posts", () => getVideoById(videoId));

  function getCurrentTranscription(): Transcription[] {
    for (const language of LanguageList) {
      if (videoResult[language])
        return JSON.parse(videoResult[language].translations);
    }
    setComponentError("Pas de transcription disponible.");
    console.log('error language not found');
    return [];
  }

  const onSeek = useCallback((time: number) => {
    youtubeRef.current?.seekTo(time);
  }, [youtubeRef]);

  console.log('renderVideoPage');
  return (
    <div className={styles.videoPage}>
      {isLoading && <Spin/>}
      {error && <Alert message="Video non trouvée" type="warning"/>}
      {componentError && <Alert message={componentError} type="warning"/>}
      <Row justify="center">
        <Col>
          {videoResult && (
            <div className={styles.video}>
              <ReactPlayer width='100%'
                height='100%'
                ref={youtubeRef}
                controls
                loop
                url={`https://www.youtube.com/watch?v=${videoId}`}
              />
            </div>
          )}
        </Col>
        <Col>
          <div className={styles.transcriptions}>
            {
              !componentError && videoResult && <TranscriptionList
                onSeek={onSeek}
                transcriptions={getCurrentTranscription()}
                query={searchParams.get(QUERY_KEY)}
              />
            }
          </div>
        </Col>
      </Row>
    </div>
  );
}
