// Import required packages
const express = require('express');          // Express framework for building the server
const bodyParser = require('body-parser');   // Middleware to parse incoming JSON requests
const graphqlHttp = require('express-graphql'); // Connects GraphQL with Express
const mongoose = require('mongoose');        // MongoDB object modeling tool
const cors = require('cors');                // Allows cross-origin requests (frontend → backend)

// Import GraphQL schema and resolvers
const graphqlSchema = require('./graphql/schema/index.js');      // Defines GraphQL types and structure
const graphqlResolvers = require('./graphql/resolvers/index.js'); // Contains resolver functions (logic)

// Import authentication middleware
const isAuth = require('./middleware/is-auth.js'); // Checks if user is authenticated before accessing routes

// Create Express application
const app = express();

// Middleware: Parse incoming JSON request bodies
// This allows us to read req.body in our routes
app.use(bodyParser.json());

// FIX #2: CORS — allow the React dev server (port 3000) to reach this backend
// Without this, the browser blocks frontend requests due to security policy
app.use(cors());

// Authentication middleware
// Runs on every request before it reaches GraphQL
// Attaches user info (if valid token is provided)
app.use(isAuth);

// GraphQL endpoint
// All GraphQL requests will be sent to http://localhost:8000/graphql
app.use(
  '/graphql',
  graphqlHttp({
    schema: graphqlSchema,        // GraphQL schema (structure of API)
    rootValue: graphqlResolvers,  // Resolver functions (business logic)
    graphiql: true                // Enables GraphiQL interface for testing queries in browser
  })
);

// Connect to MongoDB using Mongoose
mongoose
  .connect(
    // Use environment variables for security (never hardcode credentials)
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@testcluster1.wxdgvkq.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true`
  )
  .then(() => {
    // FIX #1: PORT — backend runs on 8000 to match all frontend fetch URLs
    console.log('Successfully connected to database and listening on port: 8000');
    
    // Start the Express server
    app.listen(8000);
  })
  .catch(err => {
    // If database connection fails, log the error
    console.log('Error connecting to database: ' + err);
  });
