import React, { useState } from 'react'
import MovieDataService from "../services/movies"
import { Link } from "react-router-dom"
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'

const AddReview = props => {
  console.log("=== ADD REVIEW COMPONENT ===")
  console.log("Props:", props)
  console.log("User:", props.user)
  console.log("Movie ID:", props.match.params.id)

  let editing = false
  let initialReviewState = ""

  if(props.location.state && props.location.state.currentReview){
    editing = true
    initialReviewState = props.location.state.currentReview.review
  }

  const [review, setReview] = useState(initialReviewState)
  const [submitted, setSubmitted] = useState(false)

  const onChangeReview = e => {
    const review = e.target.value
    setReview(review);
  }

  const saveReview = () => {
    console.log("=== SAVING REVIEW ===")
    
    let data = {
      review: review,
      name: props.user.name,
      user_id: props.user.id,
      movie_id: props.match.params.id
    }

    console.log("Review data:", data)

    if(editing){
      data.review_id = props.location.state.currentReview._id
      console.log("Updating review...")
      MovieDataService.updateReview(data)
        .then(response =>{
          console.log("Update response:", response.data)
          setSubmitted(true);
        })
        .catch(e =>{
          console.error("Update error:", e);
        })
    }
    else{
      console.log("Creating new review...")
      MovieDataService.createReview(data)
        .then(response => {
          console.log("Create response:", response.data)
          setSubmitted(true)
        })
        .catch(e =>{
          console.error("Create error:", e);
        }) 
    }
  }

  return(
    <Container className="mt-4">
      {submitted ? (
        <div>
          <h4>Review submitted successfully!</h4>
          <Link to={"/movies/"+props.match.params.id}>
            Back to Movie
          </Link>
        </div>
      ):(
        <div>
          {!props.user ? (
            <div>
              <h4>Please login to add a review</h4>
              <Link to="/login">Go to Login</Link>
            </div>
          ) : (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>{editing ? "Edit" : "Create"} Review</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  required
                  value={review}
                  onChange={onChangeReview}
                  placeholder="Write your review here..."
                />
              </Form.Group>
              <Button variant="primary" onClick={saveReview}>
                Submit
              </Button>
            </Form>
          )}
        </div>
      )}
    </Container>
  )
}

export default AddReview;