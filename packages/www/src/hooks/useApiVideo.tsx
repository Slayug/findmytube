import axios from "axios";
import {VideoResult, SearchVideoResult} from "@findmytube/core";
import {useQuery} from "react-query";

const VIDEO_ENDPOINT = '/videos';
export default function useApiVideo() {

  function getVideoById(videoId: string) {
    return axios.get<VideoResult>(`${VIDEO_ENDPOINT}/${videoId}`).then((r) => r.data)
  }

  function searchVideo(params: {page?: 0, q: string, channelAuthor?: string}) {
    return axios.get<SearchVideoResult>(VIDEO_ENDPOINT, {
      params: {...params}
    }).then((r) => r.data)
  }


  return {searchVideo, getVideoById}
}


export function useVideoById(videoId: string) {

  const { getVideoById } = useApiVideo();

  // about cache & stale time https://github.com/TanStack/query/discussions/1685
  return useQuery(["video", videoId], () => getVideoById(videoId), {
    cacheTime: 5,
    staleTime: 5,
    refetchOnWindowFocus: false,
  });
}
