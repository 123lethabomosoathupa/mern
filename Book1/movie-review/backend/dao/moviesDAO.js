// Import MongoDB driver
import mongodb from "mongodb"

// Extract ObjectId helper for querying by MongoDB IDs
const ObjectId = mongodb.ObjectId

// This will hold the movies collection reference
let movies

// Data Access Object (DAO) for movies collection
export default class MoviesDAO {

  // Inject database connection (runs once when server starts)
  static async injectDB(conn) {
    // Prevent re-initializing the collection
    if (movies) {
      return
    }

    try {
      // Connect to the movies collection in the specified database
      movies = await conn
        .db(process.env.MOVIEREVIEWS_NS)
        .collection('movies')
    }
    catch (e) {
      // Log connection errors
      console.error(`unable to connect in MoviesDAO: ${e}`)
    }
  }

  // ===================== GET MOVIES (WITH FILTERS & PAGINATION) =====================
  static async getMovies({
    filters = null,
    page = 0,
    moviesPerPage = 20
  } = {}) {

    let query

    // Build MongoDB query based on filters
    if (filters) {
      // Search movies by title using MongoDB text index
      if ("title" in filters) {
        query = { $text: { $search: filters['title'] } }
      }
      // Filter movies by rating (e.g. PG, R)
      else if ("rated" in filters) {
        query = { rated: { $eq: filters['rated'] } }
      }
    }

    let cursor

    try {
      // Execute query with pagination
      cursor = await movies
        .find(query)
        .limit(moviesPerPage)              // Limit results per page
        .skip(moviesPerPage * page)        // Skip previous pages

      // Convert MongoDB cursor to array
      const moviesList = await cursor.toArray()

      // Count total number of matching documents
      const totalNumMovies = await movies.countDocuments(query)

      // Return movie list and total count
      return { moviesList, totalNumMovies }
    }
    catch (e) {
      // Handle database query errors
      console.error(`Unable to issue find command, ${e}`)
      return { moviesList: [], totalNumMovies: 0 }
    }
  }

  // ===================== GET MOVIE BY ID (WITH REVIEWS) =====================
  static async getMovieById(id) {
    try {
      // Aggregate pipeline to:
      // 1. Match movie by ID
      // 2. Join related reviews from reviews collection
      return await movies
        .aggregate([
          {
            $match: {
              _id: new ObjectId(id)
            }
          },
          {
            $lookup: {
              from: 'reviews',        // Reviews collection
              localField: '_id',      // Movie ID in movies collection
              foreignField: 'movie_id', // Movie ID in reviews collection
              as: 'reviews'           // Output array field
            }
          }
        ])
        .next() // Return a single document
    }
    catch (e) {
      // Log and rethrow error
      console.error(`something went wrong in getMovieById: ${e}`)
      throw e
    }
  }

  // ===================== GET ALL RATINGS =====================
  static async getRatings() {
    let ratings = []

    try {
      // Get unique values of the "rated" field
      ratings = await movies.distinct("rated")
      return ratings
    }
    catch (e) {
      // Handle errors
      console.error(`unable to get ratings, ${e}`)
      return ratings
    }
  }
}
