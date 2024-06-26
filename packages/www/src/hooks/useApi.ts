
export function buildUrlParameters(params: any) {
  const searchParams = new URLSearchParams();
  for (const key of Object.keys(params)) {
    if (params[key] !== undefined) {
      searchParams.append(key, params[key])
    }
  }
  return searchParams;
}

export const fetcher = url => fetch(url).then(r => r.json())
