import React, { useState } from 'react';
import axios from 'axios';

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
        params: {
          api_key: 'YOUR_TMDB_API_KEY',
          query: searchTerm,
          language: 'en-US'
        }
      });
      setSearchResults(response.data.results);
    } catch (error) {
      console.error('Error searching movies:', error);
    }
  };

  const addToWatchLater = (movie) => {
    const watchLaterList = JSON.parse(localStorage.getItem('watchLater') || '[]');
    if (!watchLaterList.find(m => m.id === movie.id)) {
      watchLaterList.push(movie);
      localStorage.setItem('watchLater', JSON.stringify(watchLaterList));
    }
  };

  return (
    <div className="search-page">
      <h1>Search Movies</h1>
      <form onSubmit={handleSearch}>
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter movie title"
        />
        <button type="submit">Search</button>
      </form>

      <div className="search-results">
        {searchResults.map(movie => (
          <div key={movie.id} className="movie-card">
            <img 
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
              alt={movie.title} 
            />
            <h3>{movie.title}</h3>
            <p>Release Date: {movie.release_date}</p>
            <p>Rating: {movie.vote_average}/10</p>
            <button onClick={() => addToWatchLater(movie)}>
              Add to Watch Later
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchPage;