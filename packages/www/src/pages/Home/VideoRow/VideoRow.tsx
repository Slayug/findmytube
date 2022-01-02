import {Video} from "@fy/core";
import {Col, Row} from "antd";
import {VideoCameraOutlined} from "@ant-design/icons";

import styles from './VideoRow.module.scss';

export default function VideoRow({video}: { video: Video }) {


    function getThumbnail() {
        const thumbnail = video.videoThumbnails.find(({width}) => width === 336);
        return thumbnail ? <img src={thumbnail.url} alt="Thumbnail"/> : <VideoCameraOutlined/>;
    }

    return <div className={styles.videoRow}>
        <Row>
            <Col span={10}>
                {getThumbnail()}
            </Col>

            <Col className={styles.description} span={14}>
                <div className={styles.title}>{video.title}</div>
                <div className={styles.published}>{video.publishedText}</div>
                <div className={styles.authorLink}><a href={`https://www.youtube.com/c/${video.authorId}`}>{video.author}</a></div>
            </Col>
        </Row>

    </div>
}