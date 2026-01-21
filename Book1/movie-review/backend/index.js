// Import Express app instance
import app from './server.js'

// Import MongoDB client
import mongodb from "mongodb"

// Load environment variables from .env file
import dotenv from "dotenv"

// Import DAOs to inject database connection
import MoviesDAO from './dao/moviesDAO.js'
import ReviewsDAO from './dao/reviewsDAO.js'

// Main async function to start the server
async function main() {

  // Load environment variables into process.env
  dotenv.config()

  // Create MongoDB client using connection URI
  const client = new mongodb.MongoClient(
    process.env.MOVIEREVIEWS_DB_URI
  )

  // Set server port (fallback to 8000)
  const port = process.env.PORT || 8000

  try {
    // ===================== DATABASE CONNECTION =====================

    // Connect to MongoDB cluster
    await client.connect()

    // Inject database connection into DAOs
    await MoviesDAO.injectDB(client)
    await ReviewsDAO.injectDB(client)

    // ===================== START SERVER =====================

    // Start Express server
    app.listen(port, () => {
      console.log('Server is running on port: ' + port)
    })

  } catch (e) {
    // Log startup errors and exit process
    console.error(e)
    process.exit(1)
  }
}

// Run the main function and catch unhandled promise rejections
main().catch(console.error)
