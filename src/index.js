import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// 컴포넌트들
import Navbar from './components/Navbar';
import MainScreen from './components/MainScreen';
import WatchLaterList from './components/WatchLaterList';
import SearchPage from './components/SearchPage';

// App 컴포넌트
function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<MainScreen />} />
          <Route path="/watch-later" element={<WatchLaterList />} />
          <Route path="/search" element={<SearchPage />} />
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
