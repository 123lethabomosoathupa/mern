const User = require("../Models/UserModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");

// SIGNUP Controller
module.exports.Signup = async (req, res, next) => {
  try {
    // Extract user data from request body
    const { email, password, username, createdAt } = req.body;
    
    // Check if user already exists with this email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }
    
    // Create new user in database
    // Password will be automatically hashed by the pre-save middleware
    const user = await User.create({ email, password, username, createdAt });
    
    // Generate JWT token for the new user
    const token = createSecretToken(user._id);
    
    // Send token as HTTP-only cookie
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,  // Cookie can be accessed by client-side JavaScript
    });
    
    // Send success response
    res
      .status(201)
      .json({ 
        message: "User signed in successfully", 
        success: true, 
        user 
      });
    
    next();
  } catch (error) {
    console.error(error);
  }
};

// LOGIN Controller
module.exports.Login = async (req, res, next) => {
  try {
    // Extract credentials from request body
    const { email, password } = req.body;
    
    // Check if both fields are provided
    if (!email || !password) {
      return res.json({ message: 'All fields are required' });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: 'Incorrect password or email' });
    }
    
    // Compare provided password with hashed password in database
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.json({ message: 'Incorrect password or email' });
    }
    
    // Generate JWT token for authenticated user
    const token = createSecretToken(user._id);
    
    // Send token as cookie
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    
    // Send success response
    res.status(201).json({ 
      message: "User logged in successfully", 
      success: true 
    });
    
    next();
  } catch (error) {
    console.error(error);
  }
};