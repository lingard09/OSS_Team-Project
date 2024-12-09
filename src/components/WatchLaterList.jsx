import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Alert,
  Modal,
  Form,
} from "react-bootstrap";
import MovieCard from "./MovieCard";

function WatchLaterList() {
  const [watchLaterMovies, setWatchLaterMovies] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [review, setReview] = useState("");
  const [filters, setFilters] = useState({
    rating: 'all',
    hasReview: 'all',
    sortBy: 'date'
  });

  useEffect(() => {
    const storedMovies = JSON.parse(localStorage.getItem("watchLater") || "[]");
    const moviesWithReviews = storedMovies.map((movie) => ({
      ...movie,
      review: movie.review || "",
      addedDate: movie.addedDate || new Date().toISOString(),
    }));
    setWatchLaterMovies(moviesWithReviews);
  }, []);

  const handleRemoveClick = (movie) => {
    setSelectedMovie(movie);
    setShowConfirmModal(true);
  };

  const handleReviewClick = (movie) => {
    setSelectedMovie(movie);
    setReview(movie.review || "");
    setShowReviewModal(true);
  };

  const confirmRemove = () => {
    if (selectedMovie) {
      const updatedList = watchLaterMovies.filter(
        (movie) => movie.id !== selectedMovie.id
      );
      setWatchLaterMovies(updatedList);
      localStorage.setItem("watchLater", JSON.stringify(updatedList));
      setShowConfirmModal(false);
      setSelectedMovie(null);
    }
  };

  const saveReview = () => {
    if (selectedMovie) {
      const updatedList = watchLaterMovies.map((movie) =>
        movie.id === selectedMovie.id ? { ...movie, review } : movie
      );
      setWatchLaterMovies(updatedList);
      localStorage.setItem("watchLater", JSON.stringify(updatedList));
      setShowReviewModal(false);
      setSelectedMovie(null);
      setReview("");
    }
  };

  const deleteReview = (movieId) => {
    const updatedList = watchLaterMovies.map((movie) =>
      movie.id === movieId ? { ...movie, review: "" } : movie
    );
    setWatchLaterMovies(updatedList);
    localStorage.setItem("watchLater", JSON.stringify(updatedList));
  };

  const getFilteredMovies = () => {
    return [...watchLaterMovies]
      .filter(movie => {
        if (filters.rating !== 'all' && movie.vote_average < Number(filters.rating)) {
          return false;
        }
        if (filters.hasReview === 'yes' && !movie.review) {
          return false;
        }
        if (filters.hasReview === 'no' && movie.review) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'date':
            return new Date(b.addedDate) - new Date(a.addedDate);
          case 'rating':
            return b.vote_average - a.vote_average;
          case 'title':
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });
  };

  const filteredMovies = getFilteredMovies();

  return (
    <div className="dark-theme">
      <Container fluid className="py-4 px-4 px-md-5">
        <div className="container-inner">
          <h1 className="text-light mb-4 page-title">Watch Later List</h1>

          {watchLaterMovies.length > 0 && (
            <Row className="mb-4">
              <Col md={4}>
                <Form.Select
                  value={filters.rating}
                  onChange={(e) => setFilters({...filters, rating: e.target.value})}
                  className="bg-dark text-light border-secondary"
                >
                  <option value="all">All Ratings</option>
                  <option value="8">8+ ⭐️</option>
                  <option value="7">7+ ⭐️</option>
                  <option value="6">6+ ⭐️</option>
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Select
                  value={filters.hasReview}
                  onChange={(e) => setFilters({...filters, hasReview: e.target.value})}
                  className="bg-dark text-light border-secondary"
                >
                  <option value="all">All Movies</option>
                  <option value="yes">With Review</option>
                  <option value="no">Without Review</option>
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                  className="bg-dark text-light border-secondary"
                >
                  <option value="date">Latest Added</option>
                  <option value="rating">Highest Rating</option>
                  <option value="title">Movie Title</option>
                </Form.Select>
              </Col>
            </Row>
          )}

          <Modal
            show={showConfirmModal}
            onHide={() => setShowConfirmModal(false)}
            centered
            contentClassName="bg-dark text-light"
          >
            <Modal.Header closeButton className="border-secondary">
              <Modal.Title>Confirm Removal</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to remove "{selectedMovie?.title}" from your
              Watch Later list?
            </Modal.Body>
            <Modal.Footer className="border-secondary">
              <Button
                variant="secondary"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmRemove}>
                Remove
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            show={showReviewModal}
            onHide={() => setShowReviewModal(false)}
            centered
            contentClassName="bg-dark text-light"
          >
            <Modal.Header closeButton className="border-secondary">
              <Modal.Title>Write a Review - {selectedMovie?.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Write your expectation review here..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="bg-dark text-light"
              />
            </Modal.Body>
            <Modal.Footer className="border-secondary">
              <Button
                variant="secondary"
                onClick={() => setShowReviewModal(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" onClick={saveReview}>
                Save Review
              </Button>
            </Modal.Footer>
          </Modal>

          {watchLaterMovies.length === 0 ? (
            <Row className="justify-content-center">
              <Col xs={12} md={8} lg={6}>
                <Alert
                  variant="dark"
                  className="text-center border border-secondary"
                >
                  ❗️❗️No movies in your Watch Later list❗️❗️
                </Alert>
              </Col>
            </Row>
          ) : (
            <Row xs={1} md={2} lg={4} className="g-4">
              {filteredMovies.map((movie) => (
                <Col key={movie.id}>
                  <MovieCard
                    movie={{
                      ...movie,
                      onReviewClick: handleReviewClick,
                      onRemoveClick: handleRemoveClick,
                      onDeleteReview: deleteReview,
                    }}
                    showAddButton={false}
                    enableDetail={false}
                  />
                </Col>
              ))}
            </Row>
          )}
        </div>
        <footer className="credits mt-5">
          <div className="footer-content">
            <div className="footer-divider"></div>
            <p className="footer-text">
              Made with <span className="heart">♥</span> by{" "}
              <span className="developer-names">
                CEO Wonjin Kim & Sungju Kim
              </span>
            </p>
          </div>
        </footer>
      </Container>
    </div>
  );
}

export default WatchLaterList;