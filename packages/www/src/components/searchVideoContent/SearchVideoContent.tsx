'use client'


import useSWRInfinite from "swr/infinite";
import {SearchVideoResult} from "@findmytube/core/src";
import {searchVideoFetch, searchVideoPath} from "../../hooks/useApiVideo";
import {Fragment, useEffect} from "react";
import {useRouter} from "next/navigation";
import VideoRow from "../videoRow/VideoRow";

import styles from './SearchVideoContent.module.scss'
import {InView} from "react-intersection-observer";

export default function SearchVideoContent({searchContent, channelAuthorSelected}: {searchContent: string, channelAuthorSelected?: string}) {
  const router = useRouter()

  const { data: searchVideoResult, error, size, setSize, mutate} = useSWRInfinite<SearchVideoResult>(
    (pageIndex, previousPageData) => searchVideoPath({
      q: searchContent,
      page: pageIndex,
      channelAuthor: channelAuthorSelected
    }),
    (url) => {
      return searchVideoFetch(url);
    },
    { initialSize: 1, refreshInterval: 0, revalidateOnFocus: false });

  // `data` contiendra les données paginées
  // `error` contiendra les erreurs s'il y en a
  // `size` représente le nombre de pages chargées
  // `setSize` est une fonction pour charger plus de pages

  const isLoadingInitialData = !searchVideoResult && !error;
  const isLoadingMore = isLoadingInitialData ||
    (size > 0 && searchVideoResult && typeof searchVideoResult[size - 1] === 'undefined');

  useEffect(() => {
    if (searchContent) {
      mutate();
    }
  }, [searchContent]);

  console.log('sea', searchVideoResult)


  return <section>
    {isLoadingInitialData || isLoadingMore && <p>Loading..</p>}
    {
      searchVideoResult &&
      searchVideoResult.map(page => {
        return page.hits.map((videoResult) => {
          return <div key={videoResult._id} className={styles.video}>
            {
              (videoResult._source && videoResult._source.video) ? <VideoRow
                onClick={(videoId) => router.push(`/watch?v=${videoId}&q=${searchContent.replaceAll(" ", "+")}`)}
                video={videoResult._source.video}
              /> : <hr className={videoResult._id}/>
            }
          </div>
        })
      })
    }

    {
      (searchVideoResult && searchVideoResult.length && searchVideoResult[0].hits.length) &&
      <Fragment>
        <InView as="div" onChange={(inView) => inView && setSize(size + 1)}>
          <button
            onClick={() => setSize(size + 1)}
            className={styles.loadMore}>
            Load more.
          </button>
        </InView>
      </Fragment>
    }
  </section>
}
