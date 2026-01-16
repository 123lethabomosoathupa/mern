import express from 'express'
import MoviesController from './movies.controller.js'
import ReviewsController from './reviews.controller.js'

const router = express.Router()

// Get all movies with optional filters
router.route('/').get(MoviesController.apiGetMovies)

// Get a specific movie by ID with its reviews
router.route("/id/:id").get(MoviesController.apiGetMovieById)

// Get all available ratings
router.route("/ratings").get(MoviesController.apiGetRatings)

// Review operations
router
  .route("/review")
  .post(ReviewsController.apiPostReview)
  .put(ReviewsController.apiUpdateReview)
  .delete(ReviewsController.apiDeleteReview)

export default router