import {Video} from "@fy/core";
import {Col, Row} from "antd";
import {VideoCameraOutlined} from "@ant-design/icons";

export default function VideoRow({video}: { video: Video }) {


    function getThumbnail() {
        const thumbnail = video.videoThumbnails.find(({width}) => width === 336);
        return thumbnail ? <img src={thumbnail.url} alt="Thumbnail"/> : <VideoCameraOutlined/>;
    }

    return <div>
        <Row>

            <Col span={10}>
                {getThumbnail()}
            </Col>

            <Col span={14}>
                {video.title}
            </Col>
        </Row>

    </div>
}