import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import MovieCard from './MovieCard';  // 경로는 실제 파일 위치에 맞게 수정

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState([]);
  const searchTerm = searchParams.get('query') || '';

  useEffect(() => {
    const performSearch = async () => {
      if (searchTerm) {
        try {
          const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
            params: {
              api_key: '58b9c110c826a149e66a565692a23e40',
              query: searchTerm,
              language: 'en-US'
            }
          });
          setSearchResults(response.data.results);
        } catch (error) {
          console.error('Error searching movies:', error);
        }
      }
    };

    performSearch();
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get('searchInput');
    if (query) {
      setSearchParams({ query });
    }
  };

  const addToWatchLater = (movie) => {
    const watchLaterList = JSON.parse(localStorage.getItem('watchLater') || '[]');
    if (!watchLaterList.find(m => m.id === movie.id)) {
      watchLaterList.push(movie);
      localStorage.setItem('watchLater', JSON.stringify(watchLaterList));
      alert(`${movie.title} has been added to Watch Later`);
    } else {
      alert(`${movie.title} is already in Watch Later`);
    }
  };

  return (
    <div className="dark-theme">
      <Container fluid className="py-4 px-4 px-md-5">
        <div className="container-inner">
          <h2 className="text-light mb-4">Search Movies</h2>
          
          <Form onSubmit={handleSearch} className="mb-4">
            <Row className="justify-content-center">
              <Col xs={12} md={8} lg={6}>
                <InputGroup>
                  <Form.Control
                    name="searchInput"
                    type="text"
                    defaultValue={searchTerm}
                    placeholder="Enter movie title 🔍"
                    className="bg-dark text-light border-secondary"
                  />
                  <Button variant="danger" type="submit">
                    Search
                  </Button>
                </InputGroup>
              </Col>
            </Row>
          </Form>

          <Row xs={1} sm={2} md={3} lg={5} className="g-4">
            {searchResults.map((movie) => (
              <Col key={movie.id}>
                <MovieCard 
                  movie={movie} 
                  onAddToWatchLater={addToWatchLater}
                  showAddButton={true}
                />
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </div>
  );
}

export default SearchPage;