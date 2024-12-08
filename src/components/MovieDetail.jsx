import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Container, Row, Col, Image } from "react-bootstrap";
import axios from "axios";

function MovieDetail() {
  const { id } = useParams();
  const location = useLocation();
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}`,
          {
            params: {
              api_key: "58b9c110c826a149e66a565692a23e40",
              language: "en-US",
              append_to_response: "credits,videos,images",
            },
          }
        );
        setMovieDetails(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching movie details:", error);
        setError("Failed to load movie details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="dark-theme">
        <Container fluid className="py-4 px-4 px-md-5">
          <div className="container-inner">
            <div className="text-light text-center">Loading...</div>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dark-theme">
        <Container fluid className="py-4 px-4 px-md-5">
          <div className="container-inner">
            <div className="text-danger text-center">{error}</div>
          </div>
        </Container>
      </div>
    );
  }

  if (!movieDetails) {
    return null;
  }

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <div className="dark-theme">
      <Container fluid className="py-4 px-4 px-md-5">
        <div className="container-inner">
          <h2 className="text-light mb-4">Movie Details</h2> {/* 추가된 제목 */}
          <Row className="g-4">
            <Col md={4}>
              <Image
                src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
                alt={movieDetails.title}
                fluid
                className="rounded shadow"
              />
            </Col>
            <Col md={8}>
              <h2 className="text-light mb-4">{movieDetails.title}</h2>
              <p className="movie-overview">{movieDetails.overview}</p>
              <div className="text-secondary mb-4">
                <Row className="g-3">
                  <Col md={6}>
                    <p>
                      <strong className="text-light">Release Date:</strong>{" "}
                      {movieDetails.release_date}
                    </p>
                    <p>
                      <strong className="text-light">Rating:</strong>{" "}
                      {movieDetails.vote_average.toFixed(1)}/10
                    </p>
                    {movieDetails.runtime > 0 && (
                      <p>
                        <strong className="text-light">Runtime:</strong>{" "}
                        {formatRuntime(movieDetails.runtime)}
                      </p>
                    )}
                  </Col>
                  <Col md={6}>
                    {movieDetails.genres && movieDetails.genres.length > 0 && (
                      <p>
                        <strong className="text-light">Genres:</strong>{" "}
                        {movieDetails.genres
                          .map((genre) => genre.name)
                          .join(", ")}
                      </p>
                    )}
                    <p>
                      <strong className="text-light">Status:</strong>{" "}
                      {movieDetails.status}
                    </p>
                    <p>
                      <strong className="text-light">Original Language:</strong>{" "}
                      {movieDetails.original_language?.toUpperCase()}
                    </p>
                  </Col>
                </Row>
              </div>

              {(movieDetails.budget > 0 || movieDetails.revenue > 0) && (
                <div className="text-secondary">
                  {movieDetails.budget > 0 && (
                    <p>
                      <strong className="text-light">Budget:</strong> $
                      {movieDetails.budget.toLocaleString()}
                    </p>
                  )}
                  {movieDetails.revenue > 0 && (
                    <p>
                      <strong className="text-light">Revenue:</strong> $
                      {movieDetails.revenue.toLocaleString()}
                    </p>
                  )}
                </div>
              )}
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}

export default MovieDetail;
