import {Alert, Button, Col, Input, Row, Spin} from 'antd';

import {useNavigate, useSearchParams} from "react-router-dom";

import styles from './Home.module.scss';
import useApiVideo from "../../hooks/useApiVideo";
import {Fragment, useEffect, useRef, useState} from "react";
import {useInfiniteQuery} from "react-query";
import {SearchVideoResult} from "@findmytube/core/src/Video";
import useApiChannel from "../../hooks/useApiChannel";
import SearchBar from "./SearchBar/SearchBar";
import VideoRow from "./VideoRow/VideoRow";
import {InView} from "react-intersection-observer";
import {AxiosError} from "axios";

const QUERY_KEY = "q";
const CHANNEL_KEY = "channelAuthor";

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [inLoadMore, setInLoadMore] = useState(false);
  const searchContent = useRef<string | null>(searchParams.get(QUERY_KEY));
  const channelAuthorSelected = useRef<string | null>(searchParams.get(CHANNEL_KEY));

  const {searchVideo} = useApiVideo();
  const {searchYoutubeChannel} = useApiChannel();

  const navigate = useNavigate();

  const {
    refetch: search,
    fetchNextPage,
    data: searchVideoResult,
    isLoading,
    isError,
    error
  } = useInfiniteQuery<SearchVideoResult, AxiosError>(
    `search-${searchContent.current}-${channelAuthorSelected.current}`,
    ({pageParam}) => searchVideo({
      q: searchContent.current,
      page: pageParam ?? 0,
      channelAuthor: channelAuthorSelected.current
    }), {
      refetchOnMount: false,
      retry: false,
      enabled: searchContent.current !== null || channelAuthorSelected.current !== null,
      refetchOnWindowFocus: false,
      getNextPageParam: nextPage => nextPage ? nextPage.page + 1 : false
    });

  useEffect(() => {
    if (inLoadMore) {
      fetchNextPage();
    }
  }, [inLoadMore, fetchNextPage])

  useEffect(() => {
    updateSearchParams();
  }, [searchContent.current, channelAuthorSelected.current])

  function onPressEnterContent(change: React.KeyboardEvent<HTMLInputElement>) {
    searchContent.current = change.currentTarget.value;
    updateSearchParams();
  }

  function goToVideo(videoId: string) {
    navigate(`/watch?v=${videoId}&q=${searchContent.current.replaceAll(" ", "+")}`)
  }

  function updateSearchParams() {
    let currentParams = {};
    if (searchContent.current) {
      currentParams = {q: searchContent.current};
    }
    if (channelAuthorSelected.current) {
      currentParams = {...currentParams, channelAuthor: channelAuthorSelected.current};
    }
    setSearchParams(currentParams);
  }

  function onSelectChannel(channel: string) {
    channelAuthorSelected.current = channel
    updateSearchParams();
  }

  function onClearChannel() {
    channelAuthorSelected.current = '';
    updateSearchParams();
    search();
  }

  return <Row className={styles.home}>
    <Col span={24}>
      <Row justify="center">
        <Col xs={24} sm={24} md={18} lg={18} xl={16} xxl={14}>
          <Row justify="center">
            <Col xs={24} sm={24} md={18} lg={18} xl={16} xxl={12}>
              <Input
                autoFocus
                type="search"
                defaultValue={searchParams.get(QUERY_KEY)} size="large"
                placeholder="Search the speech"
                onPressEnter={onPressEnterContent} style={{width: '100%'}}/>
            </Col>
            <Col xs={24} sm={24} md={18} lg={18} xl={16} xxl={12}>
              <SearchBar
                defaultSearchQuery={searchParams.get(CHANNEL_KEY)}
                onSelect={onSelectChannel}
                onClear={onClearChannel}
                searchMethod={(query) => searchYoutubeChannel(query).then((response) => {
                  return response.map((channel => {
                    return {
                      key: channel.channelID,
                      value: channel.name,
                      label: <div title={channel.descriptionShort}>
                        {channel.name} {channel.descriptionShort && '-'} {channel.descriptionShort}
                      </div>
                    }
                  })) ?? []
                })}/>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row justify="center">
        <Col xs={24} sm={22} md={18} lg={18} xl={16} xxl={14}>
          {isLoading && <Spin style={{ margin: "10px" }}/>}
          {(isError && error?.response && error.response.status === 404) ?
            <Alert
              message="La chaîne est en cours de scan, merci de retenter dans quelques instants."
              type="info"/> : isError && <Alert message="Impossible de récupérer votre recherche" type="warning"/>}
          {searchVideoResult && searchVideoResult.pages.length > 0 &&
                        <div
                          className={styles.amountResult}>
                          {searchVideoResult.pages[0].total.value} résultats
                            ({searchVideoResult.pages[0].took / 1000}sec)
                        </div>
          }
          {
            searchVideoResult &&
                        searchVideoResult.pages.map(page => {
                          return page.hits.map((videoResult) => {
                            return <div key={videoResult._id} className={styles.videoRowWrap}>
                              {
                                (videoResult._source && videoResult._source.video) ? <VideoRow
                                  onClick={(videoId) => goToVideo(videoId)}
                                  video={videoResult._source.video}
                                /> : <hr className={videoResult._id}/>
                              }
                            </div>
                          })
                        })
          }
          {
            searchVideoResult &&
                        searchVideoResult.pages[0].total.value > 9 &&
                        searchVideoResult.pages.length * 9 <= searchVideoResult.pages[0].total.value &&
            <Fragment>
              <InView as="div" onChange={(inView) => setInLoadMore(inView)}>
                <Button
                  onClick={() => setInLoadMore(true)}
                  loading={inLoadMore || isLoading} className={styles.loadMore}>
                            Load more.
                </Button>
              </InView>
            </Fragment>
          }
        </Col>
      </Row>
    </Col>
  </Row>

}
