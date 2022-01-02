import Search from 'antd/es/input/Search';
import {Col, Row, Space} from 'antd';

import styles from './Home.module.scss';
import useSearchVideo from "../../hooks/useSearchVideo";

export default function Home() {

    const { searchVideo } = useSearchVideo();

    function onSearch(value: string) {
        searchVideo(value);
    }

    return <Row className={styles.home}>
        <Col span={24}>
            <Row justify="center">
                <Col span={6}>
                    <Search placeholder="input search text" onSearch={onSearch} style={{width: '100%'}}/>
                </Col>
            </Row>
        </Col>
    </Row>

}