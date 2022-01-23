import {Transcription} from "@fy/core";
import {Fragment} from "react";

export function getFullTextFrom(transcriptions: Transcription[]) {
  return transcriptions.map((transcription) => transcription.text)
    .reduce(((previousValue, currentValue) => `${previousValue} ${currentValue}`), "")
}

export function countAmountOfQuery(fullText: string, query: string) {
  const regExp = new RegExp(query,"g");
  return (fullText
    .toLowerCase()
    .match(regExp)||[]).length;
}

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

export function markWordsFrom(transcription: Transcription, startIndex: number, endIndex: number, index: number) {

  const sentence = transcription.text;
  const wordsSentence = [];
  const markedPart = sentence.substring(startIndex, endIndex);

  const appendMark = (text) => <mark id={`${index}`}>{text}</mark>

  if (startIndex === 0) {
    wordsSentence.push(appendMark(markedPart))
    if (endIndex < sentence.length) {
      wordsSentence.push(sentence.substring(endIndex, sentence.length));
    }
  } else {
    wordsSentence.push(sentence.substring(0, startIndex));
    wordsSentence.push(appendMark(markedPart))

    if (endIndex < sentence.length) {
      wordsSentence.push(sentence.substring(endIndex, sentence.length));
    }
  }

  return <Fragment>
    {wordsSentence.map((words, wordsIndex) => {
      return <Fragment key={`${transcription.start}-${wordsIndex}-${transcription.duration}-${words.length}`}>
        {words}
      </Fragment>;
    })
    }
  </Fragment>
}