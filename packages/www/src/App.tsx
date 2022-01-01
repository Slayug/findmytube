import logo from './logo.svg';
import {Config} from '@fy/core';

import {Space} from 'antd';
import Search from 'antd/es/input/Search';

function App() {

    function onSearch() {

    }

    return (
        <div className="App">
            <Space direction="vertical">
                <Search placeholder="input search text" onSearch={onSearch} style={{width: 200}}/>
            </Space>
        </div>
    );
}

export default App;
