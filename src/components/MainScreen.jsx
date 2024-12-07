import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import axios from "axios";

const MovieCard = ({ movie, onAddToWatchLater }) => {
 return (
   <Card bg="dark" text="light" className="h-100 movie-card">
     <Card.Img
       variant="top"
       src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
     />
     <Card.Body className="d-flex flex-column">
       <Card.Title className="text-light">{movie.title}</Card.Title>
       <Card.Text className="text-secondary">
         Release Date: {movie.release_date}
       </Card.Text>
       <Card.Text className="text-secondary">
         Rating: {movie.vote_average}/10
       </Card.Text>
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
 const [page, setPage] = useState(1);
 const [totalPages, setTotalPages] = useState(0);
 const [showModal, setShowModal] = useState(false);
 const [modalMessage, setModalMessage] = useState("");

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

 return (
   <Container fluid className="dark-theme py-4 px-4 px-md-5">
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
           Close
         </Button>
       </Modal.Footer>
     </Modal>

     <div className="container-inner">
       <h1 className="text-light mb-4">Top 50 Movies of the Year</h1>
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
           onClick={() => setPage(Math.max(1, page - 1))}
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
           onClick={() => setPage(Math.min(totalPages, page + 1))}
           disabled={page === totalPages}
           className="ms-3"
         >
           Next
         </Button>
       </div>
     </div>
   </Container>
 );
};

export default MainScreen;