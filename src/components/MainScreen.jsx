import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import MovieCard from "./MovieCard"; // 경로는 실제 파일 위치에 맞게 수정

const MainScreen = () => {
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;

  useEffect(() => {
    const fetchTopMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/top_rated`,
          {
            params: {
              api_key: "58b9c110c826a149e66a565692a23e40",
              page: page,
              language: "en-US",
            },
          }
        );
        setMovies(response.data.results);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    fetchTopMovies();
  }, [page]);

  const addToWatchLater = (movie) => {
    const watchLaterList = JSON.parse(
      localStorage.getItem("watchLater") || "[]"
    );

    if (!watchLaterList.find((m) => m.id === movie.id)) {
      watchLaterList.push(movie);
      localStorage.setItem("watchLater", JSON.stringify(watchLaterList));
      setModalMessage(`${movie.title} has been added to Watch Later`);
    } else {
      setModalMessage(`${movie.title} is already in Watch Later`);
    }
    setShowModal(true);
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  return (
    <div className="dark-theme">
      {" "}
      {/* Container fluid를 div.dark-theme으로 변경 */}
      <Container fluid className="py-4 px-4 px-md-5">
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          centered
          contentClassName="bg-dark text-light"
        >
          <Modal.Header closeButton className="border-secondary">
            <Modal.Title>Watch Later List</Modal.Title>
          </Modal.Header>
          <Modal.Body>{modalMessage}</Modal.Body>
          <Modal.Footer className="border-secondary">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Okay
            </Button>
          </Modal.Footer>
        </Modal>

        <div className="container-inner">
          <h2 className="text-light mb-4">Which movie sparks your interest?</h2>
          <Row xs={1} sm={2} md={3} lg={5} className="g-4">
            {movies.map((movie) => (
              <Col key={movie.id}>
                <MovieCard movie={movie} onAddToWatchLater={addToWatchLater} />
              </Col>
            ))}
          </Row>
          <div className="d-flex justify-content-center my-4">
            <Button
              variant="outline-light"
              onClick={() => handlePageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              className="me-3"
            >
              Previous
            </Button>
            <span className="text-light mx-3">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline-light"
              onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="ms-3"
            >
              Next
            </Button>
          </div>
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
};

export default MainScreen;