import {Alert, Col, Row, Spin} from 'antd';

import styles from './Home.module.scss';
import useSearchVideo from "../../hooks/useSearchVideo";
import {useEffect, useState} from "react";
import {useQuery} from "react-query";
import Search from "antd/es/input/Search";
import {SearchVideoResult} from "@fy/core/src/Video";
import VideoRow from "./VideoRow/VideoRow";

export default function Home() {

    const [searchContent, setSearchContent] = useState<string>("");
    const {searchVideo} = useSearchVideo();
    const {
        refetch: search,
        data: searchVideoResult,
        isLoading,
        isError
    } = useQuery<SearchVideoResult>(`search`, () => searchVideo(searchContent), {
        retry: false,
        enabled: false
    });

    useEffect(() => {
        if (searchContent) {
            search()
        }
    }, [searchContent, search])

    function onSearch(value: string) {
        setSearchContent(value)
    }

    return <Row className={styles.home}>
        <Col span={24}>
            <Row justify="center">
                <Col span={6}>
                    <Search size="large" placeholder="input search text" onSearch={onSearch} style={{width: '100%'}}/>
                </Col>
            </Row>
            <Row justify="center">
                <Col span={10}>
                    {isLoading && <Spin/>}
                    {isError && <Alert message="Impossible de récupérer votre recherche" type="warning" />}
                    {
                        searchVideoResult &&
                        searchVideoResult.hits.map((videoResult) => {
                            return <div key={videoResult._id} className={styles.videoRowWrap}>
                                <VideoRow video={videoResult._source.video}/>
                            </div>
                        })
                    }
                </Col>
            </Row>
        </Col>
    </Row>

}