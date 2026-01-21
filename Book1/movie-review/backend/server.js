// Import Express framework
import express from 'express'

// Import CORS middleware to allow cross-origin requests
import cors from 'cors'

// Import movie routes
import movies from './api/movies.route.js'

// Create Express application instance
const app = express()

// ===================== MIDDLEWARE =====================

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors())

// Parse incoming JSON request bodies
app.use(express.json())

// ===================== ROUTES =====================

// Mount movie-related API routes
// All routes inside movies.route.js will be prefixed with:
// /api/v1/movies
app.use('/api/v1/movies', movies)

// ===================== ERROR HANDLING =====================

// Catch-all 404 handler (must be the last middleware)
app.use((req, res) => {
  res.status(404).json({ error: 'not found' })
})

// Export app so it can be used by the server entry file
export default app
