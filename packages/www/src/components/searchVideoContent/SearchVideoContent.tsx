'use client'

import useSWRInfinite from "swr/infinite";
import {SearchVideoResult} from "@findmytube/core/src";
import {searchVideoFetch, searchVideoPath} from "@/hooks/useApiVideo";
import {Fragment, useEffect} from "react";
import {useRouter} from "next/navigation";
import VideoRow from "../videoRow/VideoRow";

import styles from './SearchVideoContent.module.scss'
import {InView} from "react-intersection-observer";
import Button from "@/components/button/Button";
import {AxiosError} from "axios";
import {SEARCH_ELEMENT_PER_PAGE} from "@findmytube/core";
import {QUERY_KEY} from "@/domain/SearchQuery";
import AppLoading from "@/app/loading";
import Loader from "@/components/loader/Loader";
import {useSearchVideosWatcher} from "@/components/searchVideoContent/UseSearchVideosWatcher";
import Link from "next/link";

function shouldDisplayScrappingLoading(results: SearchVideoResult[], error: AxiosError, scrapInProgress: boolean) {
  return (results?.at(0)?.total.value === 0 && scrapInProgress) || error?.response?.status === 404
}

function shouldDisplayScrappingMoreLoading(results: SearchVideoResult[], error: AxiosError, scrapInProgress: boolean) {
  return (results?.at(0)?.total.value !== 0 && scrapInProgress) || error?.response?.status === 404
}


export default function SearchVideoContent({searchContent, channelAuthorSelected}: {
  searchContent: string,
  channelAuthorSelected?: string
}) {
  const router = useRouter()

  const {scrapInProgress} = useSearchVideosWatcher(channelAuthorSelected);

  const {
    isLoading,
    data: searchVideoResult,
    error,
    size,
    setSize,
    mutate
  } = useSWRInfinite<SearchVideoResult, AxiosError>(
    (pageIndex) => searchVideoPath({
      q: searchContent,
      page: pageIndex,
      channelAuthor: channelAuthorSelected ?? ""
    }),
    (url) => searchVideoFetch(url),
    {
      initialSize: 1,
      refreshInterval: scrapInProgress ? 2800 : 0,
      revalidateOnFocus: false,
      revalidateOnMount: false,
      errorRetryInterval: 5500,
    });


  useEffect(() => {
    if (searchContent) {
      mutate();
    }
  }, [searchContent]);

  return <>
    <section className="px-3">
      {searchVideoResult && searchVideoResult.length > 0 &&
        <div className="flex justify-between">
          <p className={styles.amountResult}>
            {searchVideoResult[0].total.value} results
            ({searchVideoResult[0].took / 1000}sec)
          </p>
          {shouldDisplayScrappingMoreLoading(searchVideoResult, error, scrapInProgress) &&
            <div className="flex flex-row">
              <Loader />
              <p className="pl-2 text-right">Search in progress..</p>
            </div>
          }
        </div>
      }
    </section>
    <section className="lg:max-w-screen-lg pb-10">
      {(isLoading || shouldDisplayScrappingLoading(searchVideoResult, error, scrapInProgress)) &&
        <AppLoading
          message={shouldDisplayScrappingLoading(searchVideoResult, error, scrapInProgress) ?
            <p>Scrapping <i>{channelAuthorSelected}</i> videos..</p> : undefined} />
      }
      {
        searchVideoResult &&
        searchVideoResult.map(page => {
          return page.hits.map((videoResult) => {
            return <div key={videoResult._id} className={styles.video}>
              {
                (videoResult._source && videoResult._source.video) ?
                  <Link href={`/watch/${videoResult._id}?${QUERY_KEY}=${searchContent.replaceAll(" ", "+")}`}>
                    <VideoRow video={videoResult._source.video}
                    /></Link> : <hr className={videoResult._id}/>
              }
            </div>
          })
        })
      }
      {
        (searchVideoResult && (!!searchVideoResult.length) && (!!searchVideoResult[0].hits.length)) &&
        searchVideoResult.length * SEARCH_ELEMENT_PER_PAGE < searchVideoResult[0].total.value &&
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
