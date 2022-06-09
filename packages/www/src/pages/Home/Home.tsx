import {Alert, Button, Col, Row, Spin} from 'antd';

import {useNavigate, useSearchParams} from "react-router-dom";

import styles from './Home.module.scss';
import useApiVideo from "../../hooks/useApiVideo";
import {useEffect, useState} from "react";
import {useInfiniteQuery} from "react-query";
import Search from "antd/es/input/Search";
import {SearchVideoResult} from "@fy/core/src/Video";
import VideoRow from "./VideoRow/VideoRow";
import {InView} from "react-intersection-observer";

const QUERY_KEY = "q";

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [inLoadMore, setInLoadMore] = useState(false);
  const [searchContent, setSearchContent] = useState<string>(searchParams.get(QUERY_KEY));

  const {searchVideo} = useApiVideo();

  const navigate = useNavigate();

  const {
    refetch: search,
    fetchNextPage,
    data: searchVideoResult,
    isLoading,
    isError,
  } = useInfiniteQuery<SearchVideoResult>(
    `search-${searchContent}`,
    ({pageParam}) => searchVideo(searchContent, pageParam), {
      refetchOnMount: false,
      retry: false,
      enabled: false,
      getNextPageParam: nextPage => nextPage ? nextPage.page + 1 : false
    });

  useEffect(() => {
    const query = searchParams.get(QUERY_KEY);
    if (query) {
      setSearchContent(query);
    }
  }, [])

  useEffect(() => {
    if (searchContent) {
      setSearchParams({q: searchContent})
      search()
    }
  }, [searchContent, search])

  useEffect(() => {
    if (inLoadMore) {
      setTimeout(() => {
        if (inLoadMore) {
          fetchNextPage();
        }
      }, 700);
    }
  }, [inLoadMore, fetchNextPage])

  function onSearch(value: string) {
    setSearchContent(value)
  }

  function goToVideo(videoId: string) {
    navigate(`/watch?v=${videoId}&q=${searchContent.replaceAll(" ", "+")}`)
  }

  return <Row className={styles.home}>
    <Col span={24}>
      <Row justify="center">
        <Col xs={24} sm={22} md={18} lg={18} xl={16} xxl={14}>
          <Search defaultValue={searchParams.get(QUERY_KEY)} size="large" placeholder="input search text" onSearch={onSearch} style={{width: '100%'}}/>
        </Col>
      </Row>
      <Row justify="center">
        <Col xs={24} sm={22} md={18} lg={18} xl={16} xxl={14}>
          {isLoading && <Spin/>}
          {isError && <Alert message="Impossible de récupérer votre recherche" type="warning"/>}
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
                              <VideoRow
                                onClick={(videoId) => goToVideo(videoId)}
                                video={videoResult._source.video}
                              />
                            </div>
                          })
                        })
          }
          {
            searchVideoResult &&
                        searchVideoResult.pages[0].total.value > 9 &&
                        searchVideoResult.pages.length * 9 <= searchVideoResult.pages[0].total.value &&
                        <InView as="div" onChange={(inView) => setInLoadMore(inView)}>
                          <Button loading={inLoadMore || isLoading} className={styles.loadMore}>Load more.</Button>
                        </InView>
          }
        </Col>
      </Row>
    </Col>
  </Row>

}
