import {Transcription} from "@fy/core";
import {Fragment} from "react";

export function findAllIndexOfQuery(fullText: string, query: string) {

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

export function markWordsFrom(transcription: Transcription, startIndex: number, endIndex: number) {

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