import useSWR from "swr";
import {getChannelQueueInfo} from "@/hooks/useApiChannel";

export function useSearchVideosWatcher(channelId: string) {

  const {data: queueInfo} = useSWR(['queue', channelId], () => getChannelQueueInfo(channelId), {
    revalidateOnMount: false,
    revalidateOnFocus: false,
    refreshInterval: 2000
  });

  return {scrapInProgress: queueInfo?.inProgress > 0}
}
