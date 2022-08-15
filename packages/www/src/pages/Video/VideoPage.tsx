import {Fragment, useCallback, useRef} from "react";
import {useSearchParams} from "react-router-dom";
import useApiVideo from "../../hooks/useApiVideo";
import {useQuery} from "react-query";
import {Alert, Col, Row, Spin} from "antd";
import ReactPlayer from "react-player";

import styles from "./VideoPage.module.scss";
import {CaretDownOutlined, CaretUpOutlined} from "@ant-design/icons";
import {TranscriptionList} from "./TranscriptionLine";
import {LanguageList, Transcription} from "@findmytube/core";

const QUERY_KEY = "q";

export default function VideoPage() {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get("v") ?? "";
  const youtubeRef = useRef<ReactPlayer>();
  const currentIndexMarkedElement = useRef(-1);

  const {getVideoById} = useApiVideo();

  const {
    data: videoResult,
    error,
    isLoading,
  } = useQuery(["video", videoId], () => getVideoById(videoId), {
    cacheTime: 3,
    refetchOnWindowFocus: false,
  });

  function getCurrentTranscription(): Transcription[] {
    for (const language of LanguageList) {
      if (videoResult[language])
        return JSON.parse(videoResult[language].translations);
    }
    return [];
  }

  const onSeek = useCallback((time: number) => {
    youtubeRef.current?.seekTo(time);
  }, [youtubeRef]);

  function moveUp() {
    const markedElements = document.getElementsByTagName("mark");

    if (markedElements.length === 0) {
      return;
    }

    if (currentIndexMarkedElement.current <= 0) {
      currentIndexMarkedElement.current = markedElements.length - 1;
    } else {
      currentIndexMarkedElement.current -= 1;
    }
    markedElements.item(currentIndexMarkedElement.current).scrollIntoView();
  }

  function moveDown() {
    const markedElements = document.getElementsByTagName("mark");

    if (markedElements.length === 0) {
      return;
    }

    if (currentIndexMarkedElement.current >= markedElements.length - 1) {
      currentIndexMarkedElement.current = 0;
    } else {
      currentIndexMarkedElement.current += 1;
    }
    markedElements.item(currentIndexMarkedElement.current).scrollIntoView();
  }

  function renderContent() {
    if (isLoading) {
      return <Spin />
    }
    return <Fragment>
      {error && <Alert message="Video non trouvée" type="warning"/>}
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
            <div className={styles.arrows}>
              <CaretDownOutlined onClick={moveDown}/>
              <CaretUpOutlined onClick={moveUp}/>
            </div>
            <div className={styles.lines}>
              {
                videoResult ? <TranscriptionList
                  onSeek={onSeek}
                  transcriptions={getCurrentTranscription()}
                  query={searchParams.get(QUERY_KEY)}
                /> : <Alert type="info">No translation found</Alert>
              }
            </div>
          </div>
        </Col>
      </Row>


    </Fragment>
  }

  return (
    <div className={styles.videoPage}>
      {renderContent()}
    </div>
  );
}
