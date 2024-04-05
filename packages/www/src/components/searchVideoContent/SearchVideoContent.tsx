'use client'

import useSWRInfinite from "swr/infinite";
import {SearchVideoResult} from "@findmytube/core/src";
import {searchVideoFetch, searchVideoPath} from "../../hooks/useApiVideo";
import {Fragment, useEffect} from "react";
import {useRouter} from "next/navigation";
import VideoRow from "../videoRow/VideoRow";

import styles from './SearchVideoContent.module.scss'
import {InView} from "react-intersection-observer";
import Button from "../component/Button";
import {AxiosError} from "axios";
import Alert from "../alert/Alert";

export default function SearchVideoContent({searchContent, channelAuthorSelected}: {
  searchContent: string,
  channelAuthorSelected?: string
}) {
  const router = useRouter()

  const {isLoading, data: searchVideoResult, error, size, setSize, mutate} = useSWRInfinite<SearchVideoResult, AxiosError>(
    (pageIndex) => searchVideoPath({
      q: searchContent,
      page: pageIndex,
      channelAuthor: channelAuthorSelected
    }),
    (url) => {
      return searchVideoFetch(url);
    },
    {initialSize: 1,
      refreshInterval: 0,
      revalidateOnFocus: false,
      revalidateOnMount: false
    });

  const isLoadingInitialData = !searchVideoResult && !error;
  const isLoadingMore = isLoadingInitialData ||
    (size > 0 && searchVideoResult && typeof searchVideoResult[size - 1] === 'undefined');

  useEffect(() => {
    if (searchContent) {
      mutate();
    }
  }, [searchContent]);

  return <>
    <section>
      {searchVideoResult && searchVideoResult.length > 0 &&
        <div
          className={styles.amountResult}>
          {searchVideoResult[0].total.value} résultats
          ({searchVideoResult[0].took / 1000}sec)
        </div>
      }
    </section>
    {(error?.response && error.response.status === 404) &&
      <Alert message="Channel not found, searching for more content.." type="info"/>
    }
    <section>
      {isLoadingInitialData || isLoadingMore || isLoading && <p>Loading..</p>}
      {
        searchVideoResult &&
        searchVideoResult.map(page => {
          return page.hits.map((videoResult) => {
            return <div key={videoResult._id} className={styles.video}>
              {
                (videoResult._source && videoResult._source.video) ? <VideoRow
                  onClick={(videoId) => router.push(`/watch/${videoId}?q=${searchContent.replaceAll(" ", "+")}`)}
                  video={videoResult._source.video}
                /> : <hr className={videoResult._id}/>
              }
            </div>
          })
        })
      }

      {
        (searchVideoResult && (!!searchVideoResult.length) && (!!searchVideoResult[0].hits.length)) &&
        <Fragment>
          <InView as="div" onChange={(inView) => inView && setSize(size + 1)}>
            <Button
              onClick={() => setSize(size + 1)}
              className={styles.loadMore}>
              Load more.
            </Button>
          </InView>
        </Fragment>
      }
    </section>
  </>
}
