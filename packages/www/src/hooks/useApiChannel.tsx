import axios from "axios";
import {SearchVideoResult} from "@findmytube/core/src/Video";
import {SearchChannelResult, VideoResult} from "@findmytube/core/dist/Video";

const CHANNEL_ENDPOINT = '/channels';

export default function useApiChannel() {

  function searchChannel(content: string, page = 0): Promise<SearchChannelResult> {
    return axios.get(CHANNEL_ENDPOINT, {
      params: {
        q: content,
        page
      }
    }).then((r) => r.data)
  }


  return { searchChannel }
}
