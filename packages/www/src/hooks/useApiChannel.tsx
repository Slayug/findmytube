import axios from "axios";
import {ChannelQueueInfo, SearchChannelResult, SearchChannelYoutubeResult} from "@findmytube/core";

const CHANNEL_ENDPOINT = '/channels';
const CHANNEL_YOUTUBE_ENDPOINT = '/channels/youtube';

export function searchChannel(content: string, page = 0): Promise<SearchChannelResult> {
  return axios.get(CHANNEL_ENDPOINT, {
    params: {
      q: content,
      page
    }
  }).then((r) => r.data)
}


export function searchYoutubeChannel(content: string, page = 0): Promise<SearchChannelYoutubeResult[]> {
  return axios.get(CHANNEL_YOUTUBE_ENDPOINT, {
    params: {
      q: content,
      page
    }
  }).then((r) => r.data)
}

export function getChannelQueueInfo(channelId: string) {
  return axios.get<ChannelQueueInfo>(`${CHANNEL_ENDPOINT}/${channelId}/queue`)
    .then((r) => r.data)
}
