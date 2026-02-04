// FINAL FIXED reviewsDAO.js - Uses 'new ObjectId()' correctly
// File: backend/dao/reviewsDAO.js

import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let reviews

export default class ReviewsDAO {
  
  static async injectDB(conn) { 
    if (reviews) {
      return
    }
    try {
      reviews = await conn.db(process.env.MOVIEREVIEWS_NS).collection('reviews')
      console.log('Reviews collection connected successfully')
    } catch(e) {
      console.error(`Unable to establish connection handle in reviewDAO: ${e}`)
    }
  }
  
  static async addReview(movieId, user, review, date) {
    try {
      const reviewDoc = {
        name: user.name,
        user_id: String(user._id),  // Force to string for consistency
        date: date,
        review: review,
        movie_id: new ObjectId(movieId)  // ← FIXED: Added 'new'
      }
      
      console.log('Adding review:', reviewDoc)
      const result = await reviews.insertOne(reviewDoc)
      console.log('Insert result:', result)
      
      return result
    } catch(e) {
      console.error(`Unable to post review: ${e}`)
      return { error: e }
    }
  }
  
  static async updateReview(reviewId, userId, review, date) {
    try {
      console.log('=== DAO UPDATE REVIEW ===')
      console.log('Review ID:', reviewId, 'Type:', typeof reviewId)
      console.log('User ID:', userId, 'Type:', typeof userId)
      console.log('Review text:', review)
      
      // Convert userId to string for consistency
      const userIdString = String(userId)
      
      // First, find the review
      const existingReview = await reviews.findOne({ _id: new ObjectId(reviewId) })  // ← FIXED: Added 'new'
      console.log('Existing review found:', existingReview)
      
      if (!existingReview) {
        console.error('Review not found with ID:', reviewId)
        return { modifiedCount: 0, error: 'Review not found' }
      }
      
      console.log('Existing review user_id:', existingReview.user_id, 'Type:', typeof existingReview.user_id)
      console.log('Provided user_id:', userIdString, 'Type:', typeof userIdString)
      
      // Check if user IDs match (both converted to strings)
      const existingUserIdString = String(existingReview.user_id)
      const userIdMatch = existingUserIdString === userIdString
      console.log('User ID match:', userIdMatch)
      
      if (!userIdMatch) {
        console.error('User ID mismatch!')
        console.error(`Existing: ${existingUserIdString}`)
        console.error(`Provided: ${userIdString}`)
        return { modifiedCount: 0, error: 'User ID mismatch - cannot update' }
      }
      
      // Perform the update
      const updateResponse = await reviews.updateOne(
        { 
          _id: new ObjectId(reviewId)  // ← FIXED: Added 'new'
        },
        { $set: { review: review, date: date } } 
      )
      
      console.log('MongoDB update response:', updateResponse)
      console.log('Matched count:', updateResponse.matchedCount)
      console.log('Modified count:', updateResponse.modifiedCount)
      
      if (updateResponse.modifiedCount === 0) {
        console.error('No documents were modified')
      }
      
      return updateResponse
      
    } catch(e) {
      console.error(`Unable to update review: ${e}`)
      console.error('Error stack:', e.stack)
      return { error: e, modifiedCount: 0 }
    }
  }
  
  static async deleteReview(reviewId, userId) {
    try {
      console.log('=== DAO DELETE REVIEW ===')
      console.log('Review ID:', reviewId)
      console.log('User ID:', userId)
      
      // Convert to string for consistency
      const userIdString = String(userId)
      
      // First find the review
      const existingReview = await reviews.findOne({ _id: new ObjectId(reviewId) })  // ← FIXED: Added 'new'
      console.log('Review to delete:', existingReview)
      
      if (!existingReview) {
        console.error('Review not found')
        return { deletedCount: 0 }
      }
      
      // Check user ID match
      const existingUserIdString = String(existingReview.user_id)
      if (existingUserIdString !== userIdString) {
        console.error('User ID mismatch - cannot delete')
        console.error(`Existing: ${existingUserIdString}`)
        console.error(`Provided: ${userIdString}`)
        return { deletedCount: 0 }
      }
      
      const deleteResponse = await reviews.deleteOne({
        _id: new ObjectId(reviewId)  // ← FIXED: Added 'new'
      })
      
      console.log('Delete response:', deleteResponse)
      return deleteResponse
      
    } catch(e) {
      console.error(`Unable to delete review: ${e}`)
      return { error: e }
    }
  }
}