// Import the Data Access Object (DAO) that handles database operations
import MoviesDAO from '../dao/moviesDAO.js'

// Controller class responsible for handling movie-related API requests
export default class MoviesController {

  // Get a list of movies (with pagination and optional filters)
  static async apiGetMovies(req, res, next) {

    // Number of movies per page (default: 20)
    const moviesPerPage = req.query.moviesPerPage
      ? parseInt(req.query.moviesPerPage)
      : 20

    // Current page number (default: 0)
    const page = req.query.page ? parseInt(req.query.page) : 0

    // Object to store filter conditions
    let filters = {}

    // Filter movies by rating if provided in query
    if (req.query.rated) {
      filters.rated = req.query.rated
    }
    // Otherwise, filter movies by title
    else if (req.query.title) {
      filters.title = req.query.title
    }

    // Fetch movies and total count from the database
    const { moviesList, totalNumMovies } = await MoviesDAO.getMovies({
      filters,
      page,
      moviesPerPage
    })

    // Prepare the API response object
    let response = {
      movies: moviesList,              // List of movies
      page: page,                      // Current page
      filters: filters,                // Applied filters
      entries_per_page: moviesPerPage, // Movies per page
      total_results: totalNumMovies    // Total movies found
    }

    // Send response as JSON
    res.json(response)
  }

  // Get a single movie by its ID
  static async apiGetMovieById(req, res, next) {
    try {
      // Get movie ID from URL parameters
      let id = req.params.id || {}

      // Fetch movie from database
      let movie = await MoviesDAO.getMovieById(id)

      // If movie not found, return 404
      if (!movie) {
        res.status(404).json({ error: "not found" })
        return
      }

      // Return the movie data
      res.json(movie)
    }
    catch (e) {
      // Log error and return server error response
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

  // Get all available movie ratings (e.g., PG, R, G)
  static async apiGetRatings(req, res, next) {
    try {
      // Fetch ratings from database
      let propertyTypes = await MoviesDAO.getRatings()

      // Send ratings as JSON
      res.json(propertyTypes)
    }
    catch (e) {
      // Log error and return server error response
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }
}
