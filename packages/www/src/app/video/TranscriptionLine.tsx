'use client'
import {Transcription} from "@findmytube/core";
import styles from "./VideoPage.module.scss";
import {Fragment, ReactNode, useEffect, useMemo} from "react";
import {findAllIndexOfQuery, getFullTextFrom, markWordsFrom, scrollToMark} from "./VideoPageDomain";
import {useSearchParams} from "next/navigation";
import {useRouter} from "next/navigation";
import {QUERY_KEY} from "@/domain/SearchQuery";

const SHIFT_BETWEEN_LINE = ' ';
type ParsedLine = { transcription: Transcription, jsx: ReactNode};

function Inline(
  {transcription, line}: { transcription: Transcription, line: ReactNode}
) {

  const router = useRouter()
  const searchParams = useSearchParams()

  const ms = transcription.start * 1000;
  const hours = `0${new Date(ms).getHours() - 1}`.slice(-2);
  const minutes = `0${new Date(ms).getMinutes()}`.slice(-2);
  const seconds = `0${new Date(ms).getSeconds()}`.slice(-2);

  function onSeek(time: number) {
    const query = searchParams.get(QUERY_KEY)
    if (!query || query.length === 0) {
      return router.push(`?time=${time}`, { scroll: true})
    }
    return router.push(`?q=${QUERY_KEY}&time=${time}`, { scroll: true })
  }

  return <span className={styles.line}>
    <span
      onClick={() => onSeek(transcription.start)}
      className={styles.time}>
      {hours && `${hours}:`}{minutes && `${minutes}:`}{seconds ? `${seconds}` : `00`}: </span>
    {line}
  </span>

}

export function TranscriptionList(
  {transcriptions}: { onSeek?: (time: number) => void, transcriptions: Transcription[]}
) {

  const searchParams = useSearchParams()
  const query = searchParams.get(QUERY_KEY) ?? ""

  // create global memo
  const lines = useMemo(() => {
    const fullText = getFullTextFrom(transcriptions);
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
          parsedLines.push({
            transcription,
            jsx: <Inline
              transcription={transcription}
              line={
                markWordsFrom(
                  transcription,
                  relativeStartIndex,
                  relativeStartIndex + query.length
                )
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
            transcription={transcription}
            line={<Fragment>{transcription.text}</Fragment>}
          />
        })
      }
      charCount += transcription.text.length
    }

    return parsedLines;

  }, [transcriptions.length, query])

  useEffect(() => {
    // access to real DOM we are safe for first render for now, using ref need refacto
    setTimeout(() => {
      const firstMark = document.getElementsByTagName('mark').item(0);
      if (firstMark) {
        scrollToMark(document.getElementsByTagName('mark'), 0)
      }
    }, 500);
  }, [])

  return <div className={styles.lines}>
    {
      lines.map((currentLine) => {
        return <Fragment key={currentLine.transcription.start}>{currentLine.jsx}</Fragment>
      })
    }
  </div>
}
