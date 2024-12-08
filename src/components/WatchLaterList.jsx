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
import MovieCard from "./MovieCard"; // 경로는 실제 파일 위치에 맞게 수정

function WatchLaterList() {
  const [watchLaterMovies, setWatchLaterMovies] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [review, setReview] = useState("");

  useEffect(() => {
    const storedMovies = JSON.parse(localStorage.getItem("watchLater") || "[]");
    const moviesWithReviews = storedMovies.map((movie) => ({
      ...movie,
      review: movie.review || "",
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

  return (
    <div className="dark-theme">
      <Container fluid className="py-4 px-4 px-md-5">
        <div className="container-inner">
          <h1 className="text-light mb-4 page-title">Watch Later List</h1>

          {/* 삭제 확인 모달 */}
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

          {/* 리뷰 작성 모달 */}
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
              {watchLaterMovies.map((movie) => (
                <Col key={movie.id}>
                  <MovieCard
                    movie={{
                      ...movie,
                      onReviewClick: handleReviewClick,
                      onRemoveClick: handleRemoveClick,
                      onDeleteReview: deleteReview,
                    }}
                    showAddButton={false}
                    enableDetail={false} // 상세 페이지 이동 기능 비활성화
                  />
                </Col>
              ))}
            </Row>
          )}
        </div>
      </Container>
    </div>
  );
}

export default WatchLaterList;
