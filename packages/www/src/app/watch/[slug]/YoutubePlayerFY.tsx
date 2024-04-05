'use client'
import {useEffect, useState} from "react";
import YoutubePlayer from "../../../components/youtubePlayer/YoutubePlayer";


export default function YoutubePlayerFY({ videoId }: { videoId: string }) {

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true)
  }, []);

  return <>
    {isReady && <YoutubePlayer videoId={videoId} />}
  </>
}
