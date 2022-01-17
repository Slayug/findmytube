import {Fragment, useMemo, useState} from "react";
import {useSearchParams} from "react-router-dom";
import useApiVideo from "../../hooks/useApiVideo";
import {useQuery} from "react-query";
import {Alert, Col, Row, Spin} from "antd";
import ReactPlayer from "react-player";

import styles from "./VideoPage.module.scss";
import {LanguageList, Transcription} from "@fy/core/dist";

const QUERY_KEY = "q";

function findAllIndexOfQuery(fullText: string, query: string) {

  const startIndexes = []
  const getIndex = (previousIndex = 0) => fullText
    .toLowerCase()
    .indexOf(query.toLowerCase(), previousIndex);

  let indexFound = 0;
  while ((indexFound = getIndex(indexFound)) !== -1) {
    startIndexes.push(indexFound);
    indexFound++;
  }

  return startIndexes;

}

function markWordsFrom(transcription: Transcription, startIndex: number, endIndex: number) {

  const sentence = transcription.text;
  const wordsSentence = [];
  const markedPart = sentence.substring(startIndex, endIndex);

  if (startIndex === 0) {
    wordsSentence.push(<mark>{markedPart}</mark>)
    if (endIndex < sentence.length) {
      wordsSentence.push(sentence.substring(endIndex, sentence.length));
    }
  } else {
    wordsSentence.push(sentence.substring(0, startIndex));
    wordsSentence.push(<mark>{markedPart}</mark>)

    if (endIndex < sentence.length) {
      wordsSentence.push(sentence.substring(endIndex, sentence.length));
    }
  }

  return <Fragment>
    {wordsSentence.map((words, index) => {
      return <Fragment key={`${transcription.start}-${index}-${transcription.duration}-${words.length}`}>
        {words}
      </Fragment>;
    })
    }
  </Fragment>
}

function Inline({transcription, line}: { transcription: Transcription, line: JSX.Element }) {

  return <span className={styles.line}>
    <span className={styles.time}>{transcription.start}: </span>
    {line}
  </span>

}

const SHIFT_BETWEEN_LINE = ' ';

function TranscriptionList({transcriptions, query}: { transcriptions: Transcription[], query: string }) {

  // create global memo
  const lines = useMemo(() => {
    const fullText = transcriptions.map((transcription) => transcription.text)
      .reduce(((previousValue, currentValue) => `${previousValue} ${currentValue}`), "")
    const transcriptionsMapped = transcriptions.map((tr) => {
      return {start: tr.start, duration: tr.duration, text: tr.text + SHIFT_BETWEEN_LINE}
    });
      
    const startIndexes = findAllIndexOfQuery(fullText, query);
    const parsedLines: { transcription: Transcription, jsx: JSX.Element }[] = [];

    let charCount = 0;
    let untilNextLine = false;
    let charsRemaining = 0;
    
    for (const transcription of transcriptionsMapped) {
      let lineAdded = false;
      if (untilNextLine) {
        parsedLines.push({
          transcription, jsx: <Inline transcription={transcription} line={
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
          // if the full query is located within the current line
          // OR query starts within the line and end later
          // careful startIndex is relative to the global fullText, while
          parsedLines.push({
            transcription,
            jsx: <Inline
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
          jsx: <Inline transcription={transcription} line={<Fragment>{transcription.text}</Fragment>}/>
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
    return [];
  }

  return (
    <div className={styles.videoPage}>
      {isLoading && <Spin/>}
      {error && <Alert message="Video non trouvée" type="warning"/>}
      {componentError && <Alert message={componentError} type="warning"/>}
      <Row justify="center">
        <Col>
          {videoResult && (
            <ReactPlayer controls loop url={`https://www.youtube.com/watch?v=${videoId}`}/>
          )}
        </Col>
        <Col>
          <div className={styles.transcriptions}>
            {
              videoResult && <TranscriptionList
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
