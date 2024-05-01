import axios from "axios";
import {VideoResult, SearchVideoResult} from "@findmytube/core";
import {buildUrlParameters} from "./useApi";

export const VIDEO_ENDPOINT = '/videos';
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export function getVideoById(videoId: string) {
  return axios.get<VideoResult>(`${VIDEO_ENDPOINT}/${videoId}`).then((r) => r.data)
}

export function searchVideoFetch(path: string) {
  return axios.get<SearchVideoResult>(path).then((r) => r.data)
}

export function searchVideoPath(params: {page: number, q: string, channelAuthor?: string}) {
  const searchParams =  buildUrlParameters(params);

  return `${VIDEO_ENDPOINT}?${searchParams.toString()}`
}


