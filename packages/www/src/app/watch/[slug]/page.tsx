import styles from "../../video/VideoPage.module.scss";
import {TranscriptionList} from "../../video/TranscriptionLine";
import {LanguageList, Transcription} from "@findmytube/core";
import {getVideoById} from "@/hooks/useApiVideo";
import Alert from "../../../components/alert/Alert";
import MarkNavigation from "../../../components/markNavigation/MarkNavigation";
import YoutubePlayerFY from "./YoutubePlayerFY";

type WatchParams = {
  slug: string
}

export async function generateMetadata({ params }: { params: WatchParams }) {
  const videoId = params.slug
  const videoResult = await getVideoById(videoId)
  return {
    title: `${videoResult.video.title} - FindMyTube`,
    description: `Subtitle search for ${videoResult.video.title} - ${videoResult.video.author}`
  }
}

export default async function WatchPage({ params }: { params: WatchParams }) {
  const videoId = params.slug
  const videoResult = await getVideoById(videoId)

  function getCurrentTranscription(): Transcription[] {
    for (const language of LanguageList) {
      if (videoResult[language])
        return JSON.parse(videoResult[language].translations);
    }
    return [];
  }

  return (
    <div className={styles.videoPage}>
      {!videoResult && <Alert message="Video non trouvée" type="warning"/>}
      <div className="flex flex-row justify-center">
        <div>
          {videoResult && (
            <div className={styles.video}>
              <YoutubePlayerFY videoId={videoId} />
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
                /> : <Alert type="info">No translation found</Alert>
              }
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
