import axios from "axios";
import {SearchVideoResult} from "@fy/core/src/Video";
import {VideoResult} from "@fy/core/dist/Video";

axios.defaults.baseURL = `${FrontConfig.apiBaseUrl}`;


const VIDEO_ENDPOINT = '/videos';
export default function useApiVideo() {

  function getVideoById(videoId: string): Promise<VideoResult> {
    return axios.get(`${VIDEO_ENDPOINT}/${videoId}`).then((r) => r.data)
  }

  function searchVideo(content: string, page = 0): Promise<SearchVideoResult> {
    return axios.get(VIDEO_ENDPOINT, {
      params: {
        q: content,
        page
      }
    }).then((r) => r.data)
  }


  return { searchVideo, getVideoById }
}
