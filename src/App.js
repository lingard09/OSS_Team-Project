import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import MainScreen from './components/MainScreen';
import WatchLaterList from './components/WatchLaterList';
import SearchPage from './components/SearchPage';

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

export default App;