import axios from "axios";

export const fetcher = (url) => axios.get(url).then((res) => res.data);
export const fetchPage = (pageIndex) => fetcher(`/api/data?page=${pageIndex}`);


export function buildUrlParameters(params: any) {
  const searchParams = new URLSearchParams();
  for (const key of Object.keys(params)) {
    if (params[key] !== undefined) {
      searchParams.append(key, params[key])
    }
  }
  return searchParams;
}
