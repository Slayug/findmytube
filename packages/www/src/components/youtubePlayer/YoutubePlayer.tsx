'use client'
import ReactPlayer from "react-player";
import {useRef} from "react";

export default function YoutubePlayer({ videoId }: { videoId: string}) {
  const youtubeRef = useRef<ReactPlayer>();

  return <ReactPlayer width='100%'
    height='100%'
    ref={youtubeRef}
    controls
    loop
    url={`https://www.youtube.com/watch?v=${videoId}`}
  />
}
