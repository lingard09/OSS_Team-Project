import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Modal, Form } from 'react-bootstrap';

function WatchLaterList() {
 const [watchLaterMovies, setWatchLaterMovies] = useState([]);
 const [showConfirmModal, setShowConfirmModal] = useState(false);
 const [selectedMovie, setSelectedMovie] = useState(null);
 const [showReviewModal, setShowReviewModal] = useState(false);
 const [review, setReview] = useState('');

 useEffect(() => {
   const storedMovies = JSON.parse(localStorage.getItem('watchLater') || '[]');
   const moviesWithReviews = storedMovies.map(movie => ({
     ...movie,
     review: movie.review || ''
   }));
   setWatchLaterMovies(moviesWithReviews);
 }, []);

 const handleRemoveClick = (movie) => {
   setSelectedMovie(movie);
   setShowConfirmModal(true);
 };

 const handleReviewClick = (movie) => {
   setSelectedMovie(movie);
   setReview(movie.review || '');
   setShowReviewModal(true);
 };

 const confirmRemove = () => {
   if (selectedMovie) {
     const updatedList = watchLaterMovies.filter(movie => movie.id !== selectedMovie.id);
     setWatchLaterMovies(updatedList);
     localStorage.setItem('watchLater', JSON.stringify(updatedList));
     setShowConfirmModal(false);
     setSelectedMovie(null);
   }
 };

 const saveReview = () => {
   if (selectedMovie) {
     const updatedList = watchLaterMovies.map(movie => 
       movie.id === selectedMovie.id ? { ...movie, review } : movie
     );
     setWatchLaterMovies(updatedList);
     localStorage.setItem('watchLater', JSON.stringify(updatedList));
     setShowReviewModal(false);
     setSelectedMovie(null);
     setReview('');
   }
 };

 const deleteReview = (movieId) => {
   const updatedList = watchLaterMovies.map(movie => 
     movie.id === movieId ? { ...movie, review: '' } : movie
   );
   setWatchLaterMovies(updatedList);
   localStorage.setItem('watchLater', JSON.stringify(updatedList));
 };

 return (
   <Container fluid className="dark-theme py-4">
     <h2 className="text-light mb-4">Watch Later List</h2>

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
         Are you sure you want to remove "{selectedMovie?.title}" from your Watch Later list?
       </Modal.Body>
       <Modal.Footer className="border-secondary">
         <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
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
           placeholder="Write your review here..."
           value={review}
           onChange={(e) => setReview(e.target.value)}
           className="bg-dark text-light"
         />
       </Modal.Body>
       <Modal.Footer className="border-secondary">
         <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
           Cancel
         </Button>
         <Button variant="primary" onClick={saveReview}>
           Save Review
         </Button>
       </Modal.Footer>
     </Modal>

     {watchLaterMovies.length === 0 ? (
       <Alert variant="dark" className="text-center border border-secondary">
         No movies in your Watch Later list
       </Alert>
     ) : (
       <Row xs={1} md={2} lg={4} className="g-4">
         {watchLaterMovies.map(movie => (
           <Col key={movie.id}>
             <Card bg="dark" text="light" className="h-100 movie-card">
               <Card.Img 
                 variant="top" 
                 src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                 alt={movie.title}
               />
               <Card.Body className="d-flex flex-column">
                 <Card.Title className="text-light">{movie.title}</Card.Title>
                 <Card.Text className="text-secondary">
                   Release Date: {movie.release_date}
                 </Card.Text>
                 <Card.Text className="text-secondary">
                   Rating: {movie.vote_average}/10
                 </Card.Text>
                 {movie.review && (
                   <Card.Text className="text-light mt-2 position-relative">
                     <strong>My Review:</strong>
                     <Button
                       variant="link"
                       className="position-absolute top-0 end-0 p-0 text-danger"
                       onClick={() => deleteReview(movie.id)}
                       style={{ textDecoration: 'none' }}
                     >
                       ✕
                     </Button>
                     <br />
                     {movie.review}
                   </Card.Text>
                 )}
                 <div className="mt-auto">
                   <Button
                     variant="primary"
                     className="mb-2 w-100"
                     onClick={() => handleReviewClick(movie)}
                   >
                     {movie.review ? 'Edit Review' : 'Add Review'}
                   </Button>
                   <Button
                     variant="danger"
                     className="w-100"
                     onClick={() => handleRemoveClick(movie)}
                   >
                     Remove from Watch Later
                   </Button>
                 </div>
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