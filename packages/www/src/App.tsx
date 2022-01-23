import Logo from './assets/icon.png';

import {
  BrowserRouter as Router,
  Routes,
  Route, Link,
} from 'react-router-dom';
import {Content, Footer, Header} from 'antd/es/layout/layout';
import {Layout} from 'antd';
import Home from './pages/Home/Home';
import VideoPage from "./pages/Video/VideoPage";

import styles from './App.module.scss';

function App() {

  return (
    <div className="App">
      <Router>
        <Layout>
          <Header className={styles.header}>
            <Link to="/" style={{fontWeight: 'bold', color: 'white'}}>
              <img alt="FY logo" style={{height: '40px'}} src={Logo}/>
              <span style={{ marginLeft: '5px'}}>FY</span>
            </Link>
          </Header>
          <Content>
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/watch" element={<VideoPage/>}/>
            </Routes>
          </Content>
          <Footer>/</Footer>
        </Layout>
      </Router>

    </div>
  );
}

export default App;
