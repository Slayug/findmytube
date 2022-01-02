import Logo from './assets/icon.png';

import {
    BrowserRouter as Router,
    Routes,
    Route,
} from 'react-router-dom';
import {Content, Footer, Header} from 'antd/es/layout/layout';
import {Layout} from 'antd';
import Home from './pages/Home/Home';

function App() {

    return (
        <div className="App">
            <Router>
                <Layout>
                    <Header style={{color: 'white'}}><img alt="FY logo" style={{height: '40px'}} src={Logo}/> <span
                        style={{fontWeight: 'bold'}}>FY</span></Header>
                    <Content>
                        <Routes>
                            <Route path="/" element={<Home/>}>
                            </Route>
                        </Routes>
                    </Content>
                    <Footer>/</Footer>
                </Layout>
            </Router>

        </div>
    );
}

export default App;
