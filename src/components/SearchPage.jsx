import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
import axios from 'axios';

const MovieCard = ({ movie, onAddToWatchLater }) => {
  return (
    <Card>
      <Card.Img 
        variant="top" 
        src={movie.poster_path 
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
          : '/placeholder-image.jpg'
        } 
        alt={movie.title}
      />
      <Card.Body>
        <Card.Title>{movie.title}</Card.Title>
        <Card.Text>Release Date: {movie.release_date}</Card.Text>
        <Card.Text>Rating: {movie.vote_average}/10</Card.Text>
        <Button variant="danger" onClick={() => onAddToWatchLater(movie)}>
          Add to Watch Later
        </Button>
      </Card.Body>
    </Card>
  );
};

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
        params: {
          api_key: '58b9c110c826a149e66a565692a23e40',
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
    <Container>
      <h1 className="my-4">Search Movies</h1>
      <Form onSubmit={handleSearch} className="mb-4">
        <InputGroup>
          <Form.Control
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter movie title"
          />
          <Button variant="danger" type="submit">
            Search
          </Button>
        </InputGroup>
      </Form>

      <Row xs={1} sm={2} md={3} lg={5} className="g-4">
        {searchResults.map((movie) => (
          <Col key={movie.id}>
            <MovieCard 
              movie={movie} 
              onAddToWatchLater={addToWatchLater} 
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default SearchPage;