import axios from "axios";
import {SearchVideoResult} from "@findmytube/core/src/Video";
import {VideoResult} from "@findmytube/core/dist/Video";

export interface SearchVideoParams {
    q: string,
    channelAuthor?: string,
    page?: number
}

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
