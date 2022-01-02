import axios from "axios";
import {Config} from "@fy/core";
import {SearchVideoResult} from "@fy/core/src/Video";

axios.defaults.baseURL = `http://${Config.apiHost}:${Config.apiPort}`;


const VIDEO_ENDPOINT = '/videos';
export default function useSearchVideo() {

    function searchVideo(content: string): Promise<SearchVideoResult> {
        return axios.get(VIDEO_ENDPOINT, {
            params: {
                q: content
            }
        }).then((r) => r.data)
    }


    return { searchVideo }
}