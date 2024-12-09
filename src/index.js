import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// 컴포넌트들
import Menubar from './components/Menubar';
import MainScreen from './components/MainScreen';
import WatchLaterList from './components/WatchLaterList';
import SearchPage from './components/SearchPage';
import MovieDetail from './components/MovieDetail';
import OTT from './components/OTT';


// App 컴포넌트
function App() {
  return (
    <Router>
      <div className="App">
        <Menubar />
        <Routes>
          <Route path="/" element={<MainScreen />} />
          <Route path="/watch-later" element={<WatchLaterList />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/ott" element={<OTT />} />
        </Routes>
      </div>
    </Router>
  );
}

// React 렌더링
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
