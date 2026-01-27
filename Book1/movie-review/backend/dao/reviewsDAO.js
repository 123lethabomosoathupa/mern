// Import MongoDB driver
import mongodb from "mongodb"

// Extract ObjectId helper for MongoDB document IDs
const ObjectId = mongodb.ObjectId

// This will store the reviews collection reference
let reviews

// Data Access Object (DAO) for reviews collection
export default class ReviewsDAO {

  // Inject database connection (called once at server startup)
  static async injectDB(conn) {
    // Prevent re-creating the collection reference
    if (reviews) {
      return
    }

    try {
      // Connect to the reviews collection
      reviews = await conn
        .db(process.env.MOVIEREVIEWS_NS)
        .collection('reviews')
    }
    catch (e) {
      // Log connection errors
      console.error(
        `unable to establish connection handle in reviewDAO: ${e}`
      )
    }
  }

  // ===================== ADD A REVIEW =====================
  static async addReview(movieId, user, review, date) {
    try {
      // Create a review document
      const reviewDoc = {
        name: user.name,               // Reviewer's name
        user_id: user._id,             // Reviewer's user ID
        date: date,                    // Review date
        review: review,                // Review content
        movie_id: new ObjectId(movieId)    // Associated movie ID
      }

      // Insert review into the database
      return await reviews.insertOne(reviewDoc)
    }
    catch (e) {
      // Handle insertion errors
      console.error(`unable to post review: ${e}`)
      return { error: e }
    }
  }

  // ===================== UPDATE A REVIEW =====================
  static async updateReview(reviewId, userId, review, date) {
    try {
      // Update review only if the user is the original author
      const updateResponse = await reviews.updateOne(
        {
          _id: ObjectId(reviewId), // Review ID
          user_id: userId          // User ID (authorization check)
        },
        {
          $set: {
            review: review,        // Updated review text
            date: date             // Updated timestamp
          }
        }
      )

      return updateResponse
    }
    catch (e) {
      // Handle update errors
      console.error(`unable to update review: ${e}`)
      return { error: e }
    }
  }

  // ===================== DELETE A REVIEW =====================
  static async deleteReview(reviewId, userId) {
    try {
      // Delete review only if the user is the original author
      const deleteResponse = await reviews.deleteOne({
        _id: ObjectId(reviewId), // Review ID
        user_id: userId          // User ID (authorization check)
      })

      return deleteResponse
    }
    catch (e) {
      // Handle deletion errors
      console.error(`unable to delete review: ${e}`)
      return { error: e }
    }
  }
}
