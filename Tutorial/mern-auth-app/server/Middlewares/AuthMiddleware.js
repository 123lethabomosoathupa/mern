const User = require("../Models/UserModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
module.exports.userVerification = (req, res) => {
  // Extract token from cookies
  const token = req.cookies.token;
  
  // If no token exists, user is not authenticated
  if (!token) {
    return res.json({ status: false });
  }
  
  // Verify token with secret key
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      // Token is invalid or expired
      return res.json({ status: false });
    } else {
      // Token is valid, find user by ID from token payload
      const user = await User.findById(data.id);
      
      if (user) {
        // User exists, return success with username
        return res.json({ status: true, user: user.username });
      } else {
        // User not found
        return res.json({ status: false });
      }
    }
  });
};