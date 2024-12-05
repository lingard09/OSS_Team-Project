import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';

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
    <Container className="watch-later-list mt-4">
      <h2 className="mb-4">Watch Later List</h2>
      {watchLaterMovies.length === 0 ? (
        <Alert variant="info">
          No movies in your Watch Later list
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={4} className="g-4">
          {watchLaterMovies.map(movie => (
            <Col key={movie.id}>
              <Card className="h-100">
                <Card.Img 
                  variant="top" 
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                  alt={movie.title}
                />
                <Card.Body>
                  <Card.Title>{movie.title}</Card.Title>
                  <Card.Text>
                    Release Date: {movie.release_date}
                  </Card.Text>
                  <Card.Text>
                    Rating: {movie.vote_average}/10
                  </Card.Text>
                  <Button
                    variant="danger"
                    onClick={() => removeFromWatchLater(movie.id)}
                  >
                    Remove from Watch Later
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default WatchLaterList;