// Import React and hooks for state and lifecycle management
import React, { useState, useEffect } from 'react'

// Service for fetching movie and review data from the backend
import MovieDataService from '../services/movies'

// Link component for navigation
import { Link } from 'react-router-dom'

// Bootstrap components for layout and styling
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

// Moment.js for formatting dates
import moment from 'moment'

// Functional component to display a single movie and its reviews
const Movie = props => {
  
  // State to store movie data
  const [movie, setMovie] = useState({
    id: null,
    title: "",
    rated: "",
    reviews: []
  })
  
  // Fetch movie data by ID
  const getMovie = id => {
    MovieDataService.get(id)
      .then(response => {
        // Update state with movie data from API
        setMovie(response.data)
        console.log('Movie data:', response.data)
      })
      .catch(e => {
        console.error('Error fetching movie:', e)
      })
  }
  
  // Load movie data when component mounts
  // Also re-run if the movie ID in the URL changes
  useEffect(() => {
    getMovie(props.match.params.id)
  }, [props.match.params.id])
  
  // Delete a review
  const deleteReview = (reviewId, index) => {
    MovieDataService.deleteReview(reviewId, props.user.id)
      .then(response => {
        console.log('Review deleted successfully')
        // Remove deleted review from local state
        setMovie((prevState) => {
          prevState.reviews.splice(index, 1)
          return {
            ...prevState
          }
        })
      })
      .catch(e => {
        console.error('Error deleting review:', e)
      })
  }
  
  return (
    <div> 
      <Container>

        {/* Movie poster and details layout */}
        <Row>
          <Col>
            {/* Movie poster image */}
            <Image src={movie.poster + "/100px250"} fluid /> 
          </Col>

          <Col>
            {/* Movie information card */}
            <Card>
              <Card.Header as="h5">
                {movie.title}
              </Card.Header>

              <Card.Body> 
                <Card.Text>
                  {movie.plot}
                </Card.Text>

                {/* Show Add Review link only if user is logged in */}
                {props.user ? (
                  <Link to={"/movies/" + props.match.params.id + "/review"}>
                    Add Review
                  </Link>
                ) : (
                  <p className="text-muted">Please log in to add a review</p>
                )}
              </Card.Body>
            </Card>

            <br />

            {/* Reviews section */}
            <h2>Reviews</h2>
            <br /> 

            {/* Loop through reviews */}
            {movie.reviews && movie.reviews.length > 0 ? (
              movie.reviews.map((review, index) => {
                // Debugging: Log user and review info
                console.log('Current user:', props.user)
                console.log('Review user_id:', review.user_id)
                
                return (
                  <div key={review._id || index} className="mb-3 pb-3 border-bottom">

                    {/* Review author and formatted date */}
                    <h5>
                      {review.name + " reviewed on "}
                      {moment(review.date).format("Do MMMM YYYY")}
                    </h5>

                    {/* Review content */}
                    <p>{review.review}</p>

                    {/* Show Edit/Delete options only for the logged-in user */}
                    {props.user && props.user.id === review.user_id && (
                      <Row> 
                        <Col>
                          {/* Edit review link - React Router v5 syntax */}
                          <Link 
                            to={{
                              pathname: "/movies/" + props.match.params.id + "/review",
                              state: { currentReview: review }
                            }}
                            onClick={() => console.log('Edit clicked for review:', review)}
                          >
                            Edit
                          </Link>
                        </Col>

                        <Col>
                          {/* Delete review button */}
                          <Button
                            variant="link"
                            onClick={() => {
                              console.log('Delete clicked for review:', review._id)
                              deleteReview(review._id, index)
                            }}
                          >
                            Delete
                          </Button>
                        </Col>
                      </Row>
                    )}

                    {/* Debug info - remove this after fixing */}
                    {props.user && (
                      <small className="text-muted d-block mt-2">
                        Debug: User ID: {props.user.id}, Review User ID: {review.user_id}, Match: {props.user.id === review.user_id ? 'Yes' : 'No'}
                      </small>
                    )}
                  </div>
                )
              })
            ) : (
              <p>No reviews yet. Be the first to review this movie!</p>
            )}

          </Col> 
        </Row>
      </Container> 
    </div>
  );
}

// Export component for use in routing
export default Movie;