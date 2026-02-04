
import axios from "axios";

class MovieDataService {
  
  // Get all movies with optional pagination
  getAll(page = 0) {
    console.log('Calling getAll with page:', page);
    return axios.get(`https://moviesreviewbackend.onrender.com/api/v1/movies?page=${page}`)
  }

  // Get a specific movie by ID (includes reviews)
  get(id) {
    console.log('Calling get for movie ID:', id);
    return axios.get(`https://moviesreviewbackend.onrender.com/api/v1/movies/id/${id}`)
  }

  // Search movies by title or rating
  find(query, by = "title", page = 0) {
    console.log('Calling find with query:', query, 'by:', by, 'page:', page);
    return axios.get(
      `https://moviesreviewbackend.onrender.com/api/v1/movies?${by}=${query}&page=${page}`
    )
  }

  // Create a new review
  createReview(data) {
    console.log('Calling createReview with data:', data);
    return axios.post("https://moviesreviewbackend.onrender.com/api/v1/movies/review", data)
  }

  // Update an existing review
  updateReview(data) {
    console.log('Calling updateReview with data:', data);
    return axios.put("https://moviesreviewbackend.onrender.com/api/v1/movies/review", data)
  }

  // Delete a review
  deleteReview(id, userId) {
    console.log('Calling deleteReview with id:', id, 'userId:', userId);
    return axios.delete(
      "https://moviesreviewbackend.onrender.com/api/v1/movies/review",
      {data: {review_id: id, user_id: userId}}
    )
  }

  // Get all available movie ratings
  getRatings() {
    console.log('Calling getRatings');
    return axios.get("https://moviesreviewbackend.onrender.com/api/v1/movies/ratings")
  }
}

export default new MovieDataService();