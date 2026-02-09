require("dotenv").config();
const jwt = require("jsonwebtoken");

// Function to create JWT token
module.exports.createSecretToken = (id) => {
  // Sign token with user ID as payload
  return jwt.sign(
    { id },                        // Payload: user's MongoDB _id
    process.env.TOKEN_KEY,         // Secret key from .env
    {
      expiresIn: 3 * 24 * 60 * 60, // Token expires in 3 days (in seconds)
    }
  );
};