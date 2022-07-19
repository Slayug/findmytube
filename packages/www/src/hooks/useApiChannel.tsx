import axios from "axios";
import {SearchChannelResult, SearchChannelYoutubeResult} from "@findmytube/core/dist/Video";

const CHANNEL_ENDPOINT = '/channels';
const CHANNEL_YOUTUBE_ENDPOINT = '/channels/youtube';

export default function useApiChannel() {

  function searchChannel(content: string, page = 0): Promise<SearchChannelResult> {
    return axios.get(CHANNEL_ENDPOINT, {
      params: {
        q: content,
        page
      }
    }).then((r) => r.data)
  }


  function searchYoutubeChannel(content: string, page = 0): Promise<SearchChannelYoutubeResult[]> {
    return axios.get(CHANNEL_YOUTUBE_ENDPOINT, {
      params: {
        q: content,
        page
      }
    }).then((r) => r.data)
  }

  return { searchChannel, searchYoutubeChannel }
}
