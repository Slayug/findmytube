import { Fragment, useMemo, useState } from 'react';
import {useSearchParams} from "react-router-dom";
import useApiVideo from "../../hooks/useApiVideo";
import {useQuery} from "react-query";
import {Alert, Col, Row, Spin} from "antd";
import ReactPlayer from 'react-player/lazy'

import styles from './VideoPage.module.scss';
import {LanguageList, Transcription} from "@fy/core/dist";

function markQueryWords(text: string, query: string) {

  const sentenceWordsMarked = [];

  let lastIndex = 0;
  let currentIndexFound = text.toLowerCase().indexOf(query.toLowerCase());
  let nextIndexFound = 0;

  while (currentIndexFound !== -1) {

    if (currentIndexFound === 0) {
      sentenceWordsMarked.push(<mark>{text.substring(currentIndexFound, query.length)}</mark>)
      if (text.toLowerCase().indexOf(query, query.length) === -1) {
        sentenceWordsMarked.push(text.substring(currentIndexFound + query.length))
      }
    } else {
      sentenceWordsMarked.push(text.substring(lastIndex, currentIndexFound));
      sentenceWordsMarked.push(<mark>{text.substring(currentIndexFound, currentIndexFound + query.length)}</mark>);
    }

    lastIndex = currentIndexFound + query.length;
    nextIndexFound = text.toLowerCase().indexOf(query, lastIndex);

    if (nextIndexFound === -1) {
      // no other match, append end of sentence
      sentenceWordsMarked.push(text.substring(currentIndexFound + query.length));
    }
    currentIndexFound = nextIndexFound;
  }

  return sentenceWordsMarked;

}

function TranscriptionLine({transcription, urlQuery}: { transcription: Transcription, urlQuery: URLSearchParams }) {

  const query = urlQuery.get('q');

  const lineMarked = useMemo(() => {
    const indexOfQuery = transcription.text.toLowerCase().indexOf(query.toLowerCase());

    let sentence = <span className={styles.sentence}>{transcription.text}</span>;
    if (indexOfQuery > -1) {
      sentence = <span className={styles.sentence}>{
        markQueryWords(transcription.text, query).map((words) => {
          return <Fragment key={`${transcription.start}-${words}-${Date.now()}`}>{words}</Fragment>
        })
      }</span>;
    }

    return {
      text: <span className={styles.line}>
        <span className={styles.time}>{transcription.start}: </span>
        {sentence}
      </span>
    }
  }, [transcription.text, query])

  return lineMarked.text;
}

export default function VideoPage() {

  const [componentError, setComponentError] = useState<string | undefined>(undefined);
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get('v') ?? '';
  const {getVideoById} = useApiVideo();
  const {data: videoResult, error, isLoading} = useQuery("posts", () => getVideoById(videoId));

  function getCurrentTranscription(): Transcription[] {
    for (const language of LanguageList) {
      if (videoResult[language])
        return JSON.parse(videoResult[language].translations);
    }
    setComponentError('Pas de transcription disponible.')
    return [];
  }

  return <div className={styles.videoPage}>
    {isLoading && <Spin/>}
    {error && <Alert message="Video non trouvée" type="warning"/>}
    {componentError && <Alert message={componentError} type="warning" />}
    <Row justify="center">
      <Col>
        {
          videoResult && <ReactPlayer url={`https://www.youtube.com/watch?v=${videoId}`}/>
        }
      </Col>
      <Col>
        <div className={styles.transcriptions}>
          {
            videoResult && getCurrentTranscription().map((transcription) => {
              return <TranscriptionLine
                key={transcription.start}
                transcription={transcription}
                urlQuery={searchParams}/>
            })
          }
        </div>
      </Col>
    </Row>
  </div>
}