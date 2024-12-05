import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MainScreen() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchTopMovies = async () => {
      try {
        // Using The Movie DB API as mentioned in the project plan
        const response = await axios.get(`https://api.themoviedb.org/3/movie/top_rated`, {
          params: {
            api_key: 'YOUR_TMDB_API_KEY',
            page: page,
            language: 'en-US'
          }
        });
        setMovies(response.data.results.slice(0, 50));
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchTopMovies();
  }, [page]);

  const addToWatchLater = (movie) => {
    const watchLaterList = JSON.parse(localStorage.getItem('watchLater') || '[]');
    if (!watchLaterList.find(m => m.id === movie.id)) {
      watchLaterList.push(movie);
      localStorage.setItem('watchLater', JSON.stringify(watchLaterList));
    }
  };

  

  return (
    <div className="main-screen">
      <h1>Top 50 Movies of the Year</h1>
      <div className="movie-grid">
        {movies.map(movie => (
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
      <div className="pagination">
        <button 
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button 
          onClick={() => setPage(page + 1)}
          disabled={movies.length < 50}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default MainScreen;