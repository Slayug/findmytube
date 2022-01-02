import axios from "axios";
import {Config} from "@fy/core";

axios.defaults.baseURL = `http://${Config.apiHost}:${Config.apiPort}`;


const VIDEO_ENDPOINT = '/videos';
export default function useSearchVideo() {

    function searchVideo(content: string) {
        return axios.get(VIDEO_ENDPOINT, {
            params: {
                q: content
            }
        });
    }


    return { searchVideo }
}