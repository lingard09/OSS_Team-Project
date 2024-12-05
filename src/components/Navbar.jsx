import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Top 50 Movies</Link>
      </div>
      <div className="navbar-menu">
        <Link to="/watch-later">Watch Later List</Link>
        <Link to="/search">Search</Link>
      </div>
    </nav>
  );
}

export default Navbar;