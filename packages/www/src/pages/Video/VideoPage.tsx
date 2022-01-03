import {useLocation, useSearchParams} from "react-router-dom";
import useApiVideo from "../../hooks/useApiVideo";
import {useQuery} from "react-query";
import {Alert, Col, Row, Spin} from "antd";
import ReactPlayer from 'react-player/lazy'

import styles from './VideoPage.module.scss';
import {useMemo} from "react";
import {Transcription} from "@fy/core/src/Video";
import classNames from "classnames";

function TranscriptionLine({transcription, urlQuery}: { transcription: Transcription, urlQuery: URLSearchParams }) {

  const query = urlQuery.get('q');
  //TODO use only one memo to compute all data, will improve perf
  const transcriptionWordsIndexed = useMemo(() => {
    const words = query.split(' ');
    return transcription.text.split(" ").map((word, index) => {
      return {
        index: `${transcription.start}-${transcription.duration}-${transcription.text}-${index}`,
        word,
        found: words.includes(word)
      }
    })
  }, [transcription.text])

  if (query) {
    return <span>
      <span className={styles.time}>{transcription.start}: </span>
      {
        transcriptionWordsIndexed.map(({index, word, found}) => {
          return <span
            className={classNames(found && styles.wordFound, styles.word)}
            key={index}>{word}</span>
        })
      }
      <br/>
    </span>
  }

  return <span>{transcription.start}: {transcription.text}</span>
}

export default function VideoPage() {

  const [searchParams, setSearchParams] = useSearchParams();
  const videoId = searchParams.get('v') ?? '';
  const {getVideoById} = useApiVideo();
  const {data: videoResult, error, isLoading} = useQuery("posts", () => getVideoById(videoId));

  function getTranscriptions(): Transcription[] {
    if (videoResult) {
      return JSON.parse(videoResult.fr.translations);
    }
    return []
  }

  return <div className={styles.videoPage}>
    {isLoading && <Spin/>}
    {error && <Alert message="Video non trouvée" type="warning"/>}
    <Row justify="center">
      <Col>
        {
          videoResult && <ReactPlayer url={`https://www.youtube.com/watch?v=${videoId}`}/>
        }
      </Col>
      <Col>
        {videoResult?.fr && <div className={styles.transcriptions}>{
          getTranscriptions().map((transcription) => {
            return <TranscriptionLine
              key={transcription.start}
              transcription={transcription}
              urlQuery={searchParams}/>
          })
        }</div>}
      </Col>
    </Row>
  </div>
}