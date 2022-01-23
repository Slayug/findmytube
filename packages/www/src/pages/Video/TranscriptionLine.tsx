import {Transcription} from "@fy/core";
import styles from "./VideoPage.module.scss";
import {Fragment, useMemo} from "react";
import {findAllIndexOfQuery, getFullTextFrom, markWordsFrom} from "./VideoPageDomain";

const SHIFT_BETWEEN_LINE = ' ';
type ParsedLine = { transcription: Transcription, jsx: JSX.Element };

function Inline(
  {transcription, line, onSeek}: { transcription: Transcription, line: JSX.Element, onSeek: (time: number) => void }
) {

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

export function TranscriptionList(
  {onSeek, transcriptions, query}: { onSeek: (time: number) => void, transcriptions: Transcription[], query: string }
) {

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
