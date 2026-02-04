// FIXED add-review.js - Shows actual error messages
// File: src/components/add-review.js

import React, { useState } from 'react'
import MovieDataService from "../services/movies"
import { Link } from "react-router-dom"
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

const AddReview = props => {

  let editing = false
  let initialReviewState = ""
  
  if (props.location && props.location.state && props.location.state.currentReview) {
    editing = true
    initialReviewState = props.location.state.currentReview.review
    console.log('EDIT MODE - Review data:', props.location.state.currentReview)
  }
  
  const [review, setReview] = useState(initialReviewState)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)
  
  const onChangeReview = e => {
    const review = e.target.value
    setReview(review)
  }
  
  const saveReview = () => {
    setError(null) // Clear previous errors

    if (!review.trim()) {
      setError('Please enter a review')
      return
    }

    if (!props.user) {
      setError('Please log in to submit a review')
      return
    }

    var data = {
      review: review,
      name: props.user.name,
      user_id: props.user.id,
      movie_id: props.match.params.id
    }
    
    if (editing) {
      const currentReview = props.location.state.currentReview
      data.review_id = currentReview._id

      console.log('=== UPDATE REVIEW REQUEST ===')
      console.log('Review ID:', data.review_id)
      console.log('User ID:', data.user_id)
      console.log('Movie ID:', data.movie_id)
      console.log('Review text:', data.review)
      console.log('Full data object:', data)

      MovieDataService.updateReview(data)
        .then(response => {
          console.log('SUCCESS - Update response:', response.data)
          setSubmitted(true)
        })
        .catch(e => {
          console.error('ERROR - Update failed:', e)
          console.error('Error response:', e.response)
          console.error('Error response data:', e.response?.data)
          console.error('Error message:', e.message)
          
          // FIXED: Show actual error message
          let errorMsg = 'Unknown error occurred'
          
          if (e.response && e.response.data) {
            // If backend sends error in data.error
            if (typeof e.response.data.error === 'string') {
              errorMsg = e.response.data.error
            } 
            // If backend sends error object
            else if (e.response.data.error) {
              errorMsg = JSON.stringify(e.response.data.error)
            }
            // If entire data is the error message
            else if (typeof e.response.data === 'string') {
              errorMsg = e.response.data
            }
            // Otherwise stringify the whole data object
            else {
              errorMsg = JSON.stringify(e.response.data)
            }
          } else if (e.message) {
            errorMsg = e.message
          }
          
          setError(`Error updating review: ${errorMsg}`)
          console.error('DISPLAYED ERROR:', errorMsg)
        })
    } 
    else {
      console.log('=== CREATE REVIEW REQUEST ===')
      console.log('Full data object:', data)

      MovieDataService.createReview(data)
        .then(response => {
          console.log('SUCCESS - Create response:', response.data)
          setSubmitted(true)
        })
        .catch(e => {
          console.error('ERROR - Create failed:', e)
          console.error('Error response:', e.response?.data)
          
          let errorMsg = 'Unknown error occurred'
          
          if (e.response && e.response.data) {
            if (typeof e.response.data.error === 'string') {
              errorMsg = e.response.data.error
            } else if (e.response.data.error) {
              errorMsg = JSON.stringify(e.response.data.error)
            } else if (typeof e.response.data === 'string') {
              errorMsg = e.response.data
            } else {
              errorMsg = JSON.stringify(e.response.data)
            }
          } else if (e.message) {
            errorMsg = e.message
          }
          
          setError(`Error creating review: ${errorMsg}`)
          console.error('DISPLAYED ERROR:', errorMsg)
        }) 
    }
  }
  
  return (
    <div className="container mt-4">
      {submitted ? (
        <div>
          <Alert variant="success">
            <h4>Review {editing ? 'updated' : 'submitted'} successfully!</h4>
          </Alert>
          <Link to={"/movies/" + props.match.params.id}>
            <Button variant="primary">Back to Movie</Button>
          </Link>
        </div>
      ) : (
        <div>
          <h2>{editing ? "Edit" : "Create"} Review</h2>
          
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              <strong>Error:</strong> {error}
            </Alert>
          )}
          
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Your Review</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                required
                value={review}
                onChange={onChangeReview}
                placeholder="Write your review here..."
              />
            </Form.Group>

            <Button 
              variant="primary" 
              onClick={saveReview}
            >
              {editing ? 'Update' : 'Submit'} Review
            </Button>
            
            <Link to={"/movies/" + props.match.params.id}>
              <Button variant="secondary" className="ms-2">
                Cancel
              </Button>
            </Link>
          </Form>

          {/* Debug panel */}
          <div className="mt-4 p-3 bg-light border rounded">
            <h6>Debug Information</h6>
            <small className="text-muted">
              <strong>Mode:</strong> {editing ? 'Editing' : 'Creating'}<br />
              <strong>User:</strong> {props.user ? props.user.name : 'Not logged in'}<br />
              <strong>User ID:</strong> {props.user ? props.user.id : 'N/A'}<br />
              <strong>Movie ID:</strong> {props.match.params.id}<br />
              {editing && props.location?.state?.currentReview && (
                <>
                  <strong>Review ID:</strong> {props.location.state.currentReview._id}<br />
                  <strong>Original Author ID:</strong> {props.location.state.currentReview.user_id}
                </>
              )}
            </small>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddReview;