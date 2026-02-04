// Import React and hooks for state and lifecycle handling
import React, { useState, useEffect } from 'react';

// Service used to communicate with the movies API
import MovieDataService from "../services/movies";

// Link component for navigation between pages
import { Link } from "react-router-dom";

// Bootstrap components for layout and styling
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

// Functional component for displaying and searching movies
const MoviesList = props => {
  
  // State to store list of movies
  const [movies, setMovies] = useState([]);

  // State for search inputs
  const [searchTitle, setSearchTitle] = useState("");
  const [searchRating, setSearchRating] = useState("");

  // State to store available ratings for dropdown
  const [ratings, setRatings] = useState(["All Ratings"]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [entriesPerPage, setEntriesPerPage] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [currentSearchMode, setCurrentSearchMode] = useState("");

  // Runs once when component mounts
  useEffect(() => {
    retrieveMovies();
    retrieveRatings();
  }, []);

  // Reset to page 0 when search mode changes
  useEffect(() => {
    setCurrentPage(0);
  }, [currentSearchMode]);

  // Retrieve movies when page changes
  useEffect(() => {
    retrieveNextPage();
  }, [currentPage]);

  // Fetch movies based on current search mode
  const retrieveNextPage = () => {
    if (currentSearchMode === "findByTitle") {
      findByTitle();
    } else if (currentSearchMode === "findByRating") {
      findByRating();
    } else {
      retrieveMovies();
    }
  }

  // Fetch all movies from API
  const retrieveMovies = () => {
    setCurrentSearchMode("");
    MovieDataService.getAll(currentPage)
      .then(response => {
        console.log(response.data);
        setMovies(response.data.movies);
        setCurrentPage(response.data.page);
        setEntriesPerPage(response.data.entries_per_page);
        setTotalResults(response.data.total_results);
      })
      .catch(e => {
        console.log(e);
      });
  }

  // Fetch all available movie ratings
  const retrieveRatings = () => {
    MovieDataService.getRatings()
      .then(response => {
        console.log(response.data);
        // Add "All Ratings" option to the ratings list
        setRatings(["All Ratings"].concat(response.data));
      })
      .catch(e => {
        console.log(e);
      });
  }

  // Update title search state
  const onChangeSearchTitle = e => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  }

  // Update rating search state
  const onChangeSearchRating = e => {
    const searchRating = e.target.value;
    setSearchRating(searchRating);
  }

  // Generic search function (by title or rating)
  const find = (query, by) => {
    MovieDataService.find(query, by, currentPage)
      .then(response => {
        console.log(response.data);
        setMovies(response.data.movies);
        setCurrentPage(response.data.page);
        setEntriesPerPage(response.data.entries_per_page);
        setTotalResults(response.data.total_results);
      })
      .catch(e => {
        console.log(e);
      });
  }

  // Search movies by title
  const findByTitle = () => {
    setCurrentSearchMode("findByTitle");
    find(searchTitle, "title");
  }

  // Search movies by rating
  const findByRating = () => {
    setCurrentSearchMode("findByRating");
    if (searchRating === "All Ratings") {
      // If "All Ratings" is selected, show all movies
      retrieveMovies();
    } else {
      find(searchRating, "rated");
    }
  }

  return (
    <div className="App">
      <Container>

        {/* Search form */}
        <Form>
          <Row>

            {/* Search by title */}
            <Col>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Search by title"
                  value={searchTitle}
                  onChange={onChangeSearchTitle}
                />
              </Form.Group>

              <Button
                variant="primary"
                type="button"
                onClick={findByTitle}
              >
                Search
              </Button>
            </Col>

            {/* Search by rating */}
            <Col>
              <Form.Group>
                <Form.Control
                  as="select"
                  onChange={onChangeSearchRating}
                >
                  {ratings.map(rating => {
                    return (
                      <option value={rating} key={rating}>
                        {rating}
                      </option>
                    )
                  })}
                </Form.Control>
              </Form.Group>

              <Button
                variant="primary"
                type="button"
                onClick={findByRating}
              >
                Search
              </Button>
            </Col>

          </Row>
        </Form>

        <br />

        {/* Movies list */}
        <Row>
          {movies.map((movie) => {
            return (
              <Col key={movie._id}>
                <Card style={{ width: '18rem', marginBottom: '20px' }}>

                  {/* Movie poster */}
                  <Card.Img src={movie.poster + "/100px180"} />

                  <Card.Body>
                    <Card.Title>{movie.title}</Card.Title>

                    <Card.Text>
                      Rating: {movie.rated}
                    </Card.Text>

                    <Card.Text>
                      {movie.plot}
                    </Card.Text>

                    {/* Link to movie reviews page */}
                    <Link to={"/movies/" + movie._id}>
                      View Reviews
                    </Link>
                  </Card.Body>

                </Card>
              </Col>
            )
          })}
        </Row>

        {/* Pagination controls */}
        <br />
        <Row>
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                Showing page: {currentPage + 1} | 
                Total results: {totalResults}
              </div>
              <div>
                {currentPage > 0 && (
                  <Button
                    variant="outline-primary"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="me-2"
                  >
                    Previous {entriesPerPage} results
                  </Button>
                )}
                {(currentPage + 1) * entriesPerPage < totalResults && (
                  <Button
                    variant="primary"
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Get next {entriesPerPage} results
                  </Button>
                )}
              </div>
            </div>
          </Col>
        </Row>
        <br />

      </Container>
    </div>
  );
}

// Export component for use in routing
export default MoviesList;