import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import axios from 'axios';

const MovieCard = ({ movie, onAddToWatchLater }) => {
  return (
    <Card>
      <Card.Img variant="top" src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} />
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

const MainScreen = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const fetchTopMovies = async () => {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/top_rated`, {
          params: {
            api_key: '58b9c110c826a149e66a565692a23e40',
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
      
      // Show modal notification
      setModalMessage(`${movie.title} has been added to Watch Later`);
      setShowModal(true);
    } else {
      // Show modal if movie is already in the list
      setModalMessage(`${movie.title} is already in Watch Later`);
      setShowModal(true);
    }
  };

  return (
    <Container>
      {/* Modal Notification */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Watch Later List</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <h1 className="my-4">Top 50 Movies of the Year</h1>
      <Row xs={1} sm={2} md={3} lg={5} className="g-4">
        {movies.map((movie) => (
          <Col key={movie.id}>
            <MovieCard 
              movie={movie} 
              onAddToWatchLater={addToWatchLater} 
            />
          </Col>
        ))}
      </Row>
      <div className="d-flex justify-content-center my-4">
        <Button 
          variant="outline-danger" 
          onClick={() => setPage(Math.max(1, page - 1))} 
          disabled={page === 1}
        >
          Previous
        </Button>
        <span className="mx-3">Page {page}</span>
        <Button 
          variant="outline-danger" 
          onClick={() => setPage(page + 1)} 
          disabled={movies.length < 50}
        >
          Next
        </Button>
      </div>
    </Container>
  );
};

export default MainScreen;