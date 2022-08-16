import Logo from './assets/icon.png';

import {
  BrowserRouter as Router,
  Routes,
  Route, Link,
} from 'react-router-dom';
import {Content, Header} from 'antd/es/layout/layout';
import {Layout, Spin} from 'antd';
import Home from './pages/Home/Home';
import VideoPage from "./pages/Video/VideoPage";

import styles from './App.module.scss';
import axios from "axios";

import './setupI18N';
import { Suspense } from 'react';

axios.defaults.baseURL = `${FrontConfig.apiBaseUrl}`;

function App() {

  return (
    <div className={styles.app}>
      <Router>
        <Layout>
          <Header>
            <Link to="/" style={{fontWeight: 'bold', color: 'white'}}>
              <img alt="findmytube logo" style={{height: '40px'}} src={Logo}/>
              <span style={{ marginLeft: '5px'}}>FINDMYTUBE</span>
            </Link>
          </Header>
          <Content>
            <Suspense fallback={<Spin />}>
              <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/watch" element={<VideoPage/>}/>
              </Routes>
            </Suspense>
          </Content>
        </Layout>
      </Router>

    </div>
  );
}

export default App;
