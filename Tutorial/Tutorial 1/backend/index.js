// Import Express to create the backend server
import express from 'express';

// Import app configuration values
import { PORT, mongoDBURL } from './config.js';

// Import Mongoose for MongoDB connection
import mongoose from 'mongoose';

// Import routes related to books
import booksRoute from './routes/booksRoute.js';

// Import CORS to allow frontend-backend communication
import cors from 'cors';

// Create an Express application
const app = express();

// Enable JSON parsing for incoming requests
app.use(express.json());

// Enable Cross-Origin Resource Sharing
// This allows requests from the frontend to reach the backend
app.use(cors());

// Default route to test if the server is running
app.get('/', (request, response) => {
  return response.status(234).send('Welcome To MERN Stack Tutorial');
});

// Route handler for all book-related API endpoints
app.use('/books', booksRoute);

// Connect to MongoDB and start the server
mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log('App connected to database');

    // Start listening for requests once DB connection is successful
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    // Log database connection errors
    console.log(error);
  });
