import {useParams} from "react-router-dom";
import useApiVideo from "../../hooks/useApiVideo";
import {useQuery} from "react-query";
import {Alert, Col, Row, Spin} from "antd";
import ReactPlayer from 'react-player/lazy'
import {Translation} from "@fy/core/dist/Video";

import styles from './VideoPage.module.scss';

export default function VideoPage() {

  const {videoId} = useParams();
  const {getVideoById} = useApiVideo();
  const {data: videoResult, error, isLoading} = useQuery("posts", () => getVideoById(videoId));

  function getTranscriptions(): Translation[] {
    if (videoResult) {
      return JSON.parse(videoResult.fr.translations);
    }
    return []
  }

  return <div className={styles.videoPage}>
    {isLoading && <Spin />}
    {error && <Alert message="Video non trouvée" type="warning"/>}
    <Row justify="center">
      <Col>
        {
          videoResult && <ReactPlayer url={`https://www.youtube.com/watch?v=${videoId}`}/>
        }
      </Col>
      <Col>
        {videoResult?.fr && <div className={styles.transcriptions}>{
          getTranscriptions().map((translation) => {
            return <div key={translation.start}>{translation.start}: {translation.text}</div>
          })
        }</div>}
      </Col>
    </Row>
  </div>
}