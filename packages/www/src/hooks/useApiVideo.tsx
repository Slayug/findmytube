import axios from "axios";
import {VideoResult, SearchVideoResult} from "@findmytube/core";

const VIDEO_ENDPOINT = '/videos';


export function getVideoById(videoId: string) {
  return axios.get<VideoResult>(`${VIDEO_ENDPOINT}/${videoId}`).then((r) => r.data)
}

export function searchVideo(params: {page: number, q: string, channelAuthor?: string}) {
  return axios.get<SearchVideoResult>(VIDEO_ENDPOINT, {
    params: {...params}
  }).then((r) => r.data)
}


