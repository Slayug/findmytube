'use client'
import {useEffect, useRef, useState} from "react";
import {useSearchParams} from "next/navigation";
import ReactPlayer from "react-player";
import {TIME_KEY} from "@/domain/SearchQuery";

export default function YoutubePlayerFY({ videoId }: { videoId: string }) {

  const searchParams = useSearchParams();

  const youtubePlayer = useRef<ReactPlayer>();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true)
  }, []);

  useEffect(() => {
    const time = parseInt(searchParams.get(TIME_KEY));
    if (isNaN(time)) {
      return
    }
    youtubePlayer.current?.seekTo(time)
  }, [searchParams]);


  return <>
    {isReady && <ReactPlayer width='100%'
      height='100%'
      ref={youtubePlayer}
      controls
      loop
      url={`https://www.youtube.com/watch?v=${videoId}`}
    />}
  </>
}
