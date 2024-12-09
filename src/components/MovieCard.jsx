import React, { useState, useEffect } from "react";
import { Card, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MovieCard = ({
  movie,
  onAddToWatchLater,
  showAddButton = true,
  enableDetail = true,
}) => {
  const navigate = useNavigate();
  const [movieDetails, setMovieDetails] = useState(null);
  const [watchProviders, setWatchProviders] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const [detailsResponse, providersResponse] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/${movie.id}`, {
            params: {
              api_key: "58b9c110c826a149e66a565692a23e40",
              append_to_response: "credits",
            },
          }),
          axios.get(
            `https://api.themoviedb.org/3/movie/${movie.id}/watch/providers`,
            {
              params: {
                api_key: "58b9c110c826a149e66a565692a23e40",
              },
            }
          ),
        ]);
        setMovieDetails(detailsResponse.data);
        setWatchProviders(providersResponse.data.results.KR?.flatrate || []);
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
        onClick={enableDetail ? handlePosterClick : undefined} // 조건부 클릭 이벤트
        style={{ cursor: enableDetail ? "pointer" : "default" }} // 조건부 커서 스타일
        className="poster-container"
      >
        <Card.Img
          variant="top"
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "/placeholder-image.jpg"
          }
          alt={movie.title}
        />
        {enableDetail && (
          <div className="poster-overlay">
            <span>Click for details</span>
          </div>
        )}
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
          {watchProviders && watchProviders.length > 0 && (
            <div className="ott-logos mt-2">
              <p className="mb-1">
                <small>
                  <strong>Available on:</strong>
                </small>
              </p>
              <div className="d-flex gap-1 flex-wrap align-items-center">
                {watchProviders.map((provider) => (
                  <OverlayTrigger
                    key={provider.provider_id}
                    placement="top"
                    overlay={
                      <Tooltip id={`tooltip-${provider.provider_id}`}>
                        {provider.provider_name}
                      </Tooltip>
                    }
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                      alt={provider.provider_name}
                      className="ott-logo"
                      style={{
                        width: "32px",
                        height: "32px",
                        minWidth: "32px",
                        minHeight: "32px",
                        maxWidth: "32px",
                        maxHeight: "32px",
                      }}
                    />
                  </OverlayTrigger>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 리뷰 표시 부분 추가 */}
        {movie.review && (
          <div className="movie-review text-light mb-3 position-relative">
            <strong>My Review:</strong>
            <Button
              variant="link"
              className="position-absolute top-0 end-0 p-0 text-danger"
              onClick={() => movie.onDeleteReview?.(movie.id)}
              style={{ textDecoration: "none" }}
            >
              ✕
            </Button>
            <p className="mt-1 mb-0" style={{ fontSize: "0.9rem" }}>
              {movie.review}
            </p>
          </div>
        )}

        {/* 버튼 부분 */}
        {!showAddButton && (
          <div className="mt-auto d-flex">
            <Button
              variant="primary"
              className="flex-grow-1 me-2"
              onClick={() => movie.onReviewClick?.(movie)}
            >
              {movie.review ? "Edit Review" : "Add Review"}
            </Button>
            <Button
              variant="danger"
              className="flex-grow-1"
              onClick={() => movie.onRemoveClick?.(movie)}
            >
              Remove
            </Button>
          </div>
        )}
        {showAddButton && (
          <Button
            variant="danger"
            className="mt-auto"
            onClick={() => onAddToWatchLater(movie)}
          >
            Add to Watch Later
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default MovieCard;