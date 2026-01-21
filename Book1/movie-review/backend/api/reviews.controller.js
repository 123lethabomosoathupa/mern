// Import the Reviews Data Access Object (DAO)
// This handles all database operations related to reviews
import ReviewsDAO from '../dao/reviewsDAO.js'

// Controller class for handling review-related API requests
export default class ReviewsController {

  // ===================== ADD A REVIEW =====================
  static async apiPostReview(req, res, next) {
    try {
      // Extract movie ID from request body
      const movieId = req.body.movie_id

      // Extract review text from request body
      const review = req.body.review

      // Create user information object
      const userInfo = {
        name: req.body.name,     // Reviewer's name
        _id: req.body.user_id    // Reviewer's user ID
      }

      // Create a timestamp for the review
      const date = new Date()

      // Save the review to the database
      const ReviewResponse = await ReviewsDAO.addReview(
        movieId,
        userInfo,
        review,
        date
      )

      // Send success response
      res.json({ status: "success" })
    } catch (e) {
      // Handle server errors
      res.status(500).json({ error: e.message })
    }
  }

  // ===================== UPDATE A REVIEW =====================
  static async apiUpdateReview(req, res, next) {
    try {
      // Extract review ID from request body
      const reviewId = req.body.review_id

      // Extract updated review text
      const review = req.body.review

      // Update timestamp
      const date = new Date()

      // Attempt to update the review in the database
      const ReviewResponse = await ReviewsDAO.updateReview(
        reviewId,
        req.body.user_id, // Ensure only the original user can update
        review,
        date
      )

      // Check for database-level errors
      var { error } = ReviewResponse
      if (error) {
        res.status(400).json({ error })
        return
      }

      // If no document was modified, the user may not be the original poster
      if (ReviewResponse.modifiedCount === 0) {
        throw new Error(
          "Unable to update review. User may not be original poster"
        )
      }

      // Send success response
      res.json({ status: "success" })
    } catch (e) {
      // Handle server errors
      res.status(500).json({ error: e.message })
    }
  }

  // ===================== DELETE A REVIEW =====================
  static async apiDeleteReview(req, res, next) {
    try {
      // Extract review ID and user ID from request body
      const reviewId = req.body.review_id
      const userId = req.body.user_id

      // Attempt to delete the review from the database
      const ReviewResponse = await ReviewsDAO.deleteReview(
        reviewId,
        userId
      )

      // Send success response
      res.json({ status: "success" })
    } catch (e) {
      // Handle server errors
      res.status(500).json({ error: e.message })
    }
  }
}
