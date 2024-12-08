import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const MovieCard = ({ movie, onAddToWatchLater }) => {
  const navigate = useNavigate();
  const [movieDetails, setMovieDetails] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movie.id}`,
          {
            params: {
              api_key: "58b9c110c826a149e66a565692a23e40",
              append_to_response: "credits",
            },
          }
        );
        setMovieDetails(response.data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };
    fetchMovieDetails();
  }, [movie.id]);

  const handlePosterClick = () => {
    navigate(`/movie/${movie.id}`, { state: { movieData: movie } });
  };

  const director = movieDetails?.credits?.crew.find(
    (person) => person.job === "Director"
  )?.name;

  const formatRuntime = (minutes) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <Card bg="dark" text="light" className="h-100 movie-card">
      <div
        onClick={handlePosterClick}
        style={{ cursor: "pointer" }}
        className="poster-container"
      >
        <Card.Img
          variant="top"
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
        />
        <div className="poster-overlay">
          <span>Click for details</span>
        </div>
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title className="text-light mb-3">{movie.title}</Card.Title>
        <div className="movie-details text-secondary mb-3">
          <p className="mb-1">
            <small>
              <strong>Director:</strong> {director || "N/A"}
            </small>
          </p>
          <p className="mb-1">
            <small>
              <strong>Genre:</strong>{" "}
              {movieDetails?.genres?.map((genre) => genre.name).join(", ") ||
                "N/A"}
            </small>
          </p>
          <p className="mb-1">
            <small>
              <strong>Runtime:</strong> {formatRuntime(movieDetails?.runtime)}
            </small>
          </p>
          <p className="mb-1">
            <small>
              <strong>Rating:</strong> {movie.vote_average.toFixed(1)}/10
            </small>
          </p>
          <p className="mb-1">
            <small>
              <strong>Release:</strong> {movie.release_date}
            </small>
          </p>
        </div>
        <Button
          variant="danger"
          className="mt-auto"
          onClick={() => onAddToWatchLater(movie)}
        >
          Add to Watch Later
        </Button>
      </Card.Body>
    </Card>
  );
};

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
        <footer className="credits">
          <p>Made by. CEO Wonjin Kim & Sungju Kim</p>
        </footer>
      </Container>
    </div>
  );
};

export default MainScreen;
