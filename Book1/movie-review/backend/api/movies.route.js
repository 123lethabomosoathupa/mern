// Import Express framework
import express from 'express'

// Import controllers that handle business logic
import MoviesController from './movies.controller.js'
import ReviewsController from './reviews.controller.js'

// Create a new Express router instance
const router = express.Router()

// ===================== MOVIE ROUTES =====================

// Get all movies
// Supports optional query parameters like:
// ?page=0&moviesPerPage=20&rated=PG&title=Batman
router.route('/')
  .get(MoviesController.apiGetMovies)

// Get a specific movie by its ID
// Example: /api/v1/movies/id/12345
router.route('/id/:id')
  .get(MoviesController.apiGetMovieById)

// Get all available movie ratings (e.g. G, PG, PG-13, R)
router.route('/ratings')
  .get(MoviesController.apiGetRatings)

// ===================== REVIEW ROUTES =====================

// Handle review-related operations
// POST   → Add a new review
// PUT    → Update an existing review
// DELETE → Remove a review
router.route('/review')
  .post(ReviewsController.apiPostReview)
  .put(ReviewsController.apiUpdateReview)
  .delete(ReviewsController.apiDeleteReview)

// Export router so it can be used in the main app (app.js / server.js)
export default router
