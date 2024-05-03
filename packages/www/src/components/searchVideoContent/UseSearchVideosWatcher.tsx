import useSWR from "swr";
import {getChannelQueueInfo} from "@/hooks/useApiChannel";
import {useEffect, useRef, useState} from "react";

export function useSearchVideosWatcher(channelId: string) {
  const [countZeroProgress, setCountZeroProgress] = useState(0)

  const {data: queueInfo} = useSWR(['queue', channelId], () => getChannelQueueInfo(channelId), {
    revalidateOnMount: false,
    revalidateOnFocus: false,
    refreshInterval: (channelId && countZeroProgress < 5) ? 2000 : 0,
    onSuccess: () => {
      if (queueInfo?.inProgress === 0) {
        setCountZeroProgress(previous => previous + 1)
      }
    }
  });

  useEffect(() => {
    return () => {
      setCountZeroProgress(0)
    }
  }, [channelId]);


  return {scrapInProgress: queueInfo?.inProgress > 0}
}
