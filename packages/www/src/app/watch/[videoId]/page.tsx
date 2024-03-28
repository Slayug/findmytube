import styles from "../../video/VideoPage.module.scss";
import {TranscriptionList} from "../../video/TranscriptionLine";
import {LanguageList, Transcription} from "@findmytube/core";
import {getVideoById} from "../../../hooks/useApiVideo";
import Alert from "../../../components/alert/Alert";
import YoutubePlayer from "../../../components/youtubePlayer/YoutubePlayer";
import MarkNavigation from "../../../components/markNavigation/MarkNavigation";

const QUERY_KEY = "q";

export async function generateMetadata({ params }) {
  const videoResult = await getVideoById(params.videoId)
  return {
    title: videoResult.video.title,
    description: `Subtitle search for ${videoResult.video.title} - ${videoResult.video.author}`
  }
}

export default async function WatchPage({ params }: { params: { videoId: string }}) {
  const videoResult = await getVideoById(params.videoId)

  function getCurrentTranscription(): Transcription[] {
    for (const language of LanguageList) {
      if (videoResult[language])
        return JSON.parse(videoResult[language].translations);
    }
    return [];
  }

  //TODO setup onSeek
  //const onSeek = useCallback((time: number) => {
  //youtubeRef.current?.seekTo(time);
  //}, [youtubeRef]);



  return (
    <div className={styles.videoPage}>
      {!videoResult && <Alert message="Video non trouvée" type="warning"/>}
      <div className="grid grid-cols-2">
        <div>
          {videoResult && (
            <div className={styles.video}>
              <YoutubePlayer videoId={params.videoId} />
            </div>
          )}
        </div>
        <div>
          <div className={styles.transcriptions}>
            <MarkNavigation />
            <div className={styles.lines}>
              {
                videoResult ? <TranscriptionList
                  transcriptions={getCurrentTranscription()}
                  query={`TODO replace with search parameter`}
                /> : <Alert type="info">No translation found</Alert>
              }
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
