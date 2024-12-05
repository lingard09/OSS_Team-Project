import React, { useState, useEffect } from 'react';

function WatchLaterList() {
  const [watchLaterMovies, setWatchLaterMovies] = useState([]);

  useEffect(() => {
    const storedMovies = JSON.parse(localStorage.getItem('watchLater') || '[]');
    setWatchLaterMovies(storedMovies);
  }, []);

  const removeFromWatchLater = (movieId) => {
    const updatedList = watchLaterMovies.filter(movie => movie.id !== movieId);
    setWatchLaterMovies(updatedList);
    localStorage.setItem('watchLater', JSON.stringify(updatedList));
  };

  return (
    <div className="watch-later-list">
      <h1>Watch Later List</h1>
      {watchLaterMovies.length === 0 ? (
        <p>No movies in your Watch Later list</p>
      ) : (
        <div className="movie-grid">
          {watchLaterMovies.map(movie => (
            <div key={movie.id} className="movie-card">
              <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title} 
              />
              <h3>{movie.title}</h3>
              <p>Release Date: {movie.release_date}</p>
              <button onClick={() => removeFromWatchLater(movie.id)}>
                Remove from Watch Later
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WatchLaterList;
