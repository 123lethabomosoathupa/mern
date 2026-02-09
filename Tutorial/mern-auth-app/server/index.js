const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoute = require("./Routes/AuthRoute");
require("dotenv").config();

const app = express();

// Destructure environment variables
const { MONGO_URL, PORT } = process.env;

// Connect to MongoDB (UPDATED - no deprecated options)
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB is connected successfully"))
  .catch((err) => console.error(err));

// Start server on specified port
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// Configure CORS to allow requests from React frontend
app.use(
  cors({
    origin: ["http://localhost:3000"],              // Allow requests from React app
    methods: ["GET", "POST", "PUT", "DELETE"],      // Allowed HTTP methods
    credentials: true,                               // Allow cookies to be sent
  })
);

// Middleware to parse cookies
app.use(cookieParser());

// Middleware to parse JSON request bodies
app.use(express.json());

// Use authentication routes
app.use("/", authRoute);