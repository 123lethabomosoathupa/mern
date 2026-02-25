// Import bcrypt for hashing passwords securely
const bcrypt = require('bcrypt');

// Import jsonwebtoken to create authentication tokens
const jwt = require('jsonwebtoken');

// Import User model (MongoDB collection)
const User = require('../../models/user.js');

module.exports = {

  // ===============================
  // CREATE USER (REGISTER)
  // ===============================
  createUser: async args => {
    try {

      // Check if a user with the same email already exists
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error('User exists already.');
      }

      // Hash the password before saving to database
      // 12 = salt rounds (higher = more secure but slower)
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      // Create new user instance
      const user = new User({
        email: args.userInput.email,
        password: hashedPassword // Store hashed password, NOT plain text
      });

      // Save user to database
      const result = await user.save();

      // Return user data
      // _doc contains the actual MongoDB document data
      // We set password to null so it is NOT returned to the client
      return { 
        ...result._doc, 
        password: null, 
        _id: result.id 
      };

    } catch (err) {
      // If any error occurs, throw it so GraphQL can handle it
      throw err;
    }
  },


  // ===============================
  // LOGIN USER
  // ===============================
  login: async ({ email, password }) => {

    // Find user by email
    const user = await User.findOne({ email: email });

    // If user doesn't exist → throw error
    if (!user) {
      throw new Error('User does not exist!');
    }

    // Compare entered password with hashed password in DB
    const isEqual = await bcrypt.compare(password, user.password);

    // If passwords don't match → throw error
    if (!isEqual) {
      throw new Error('Password is incorrect!');
    }

    // FIX #4: Use environment variable instead of hardcoded secret
    // Create JWT token containing user ID and email
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email 
      },
      process.env.JWT_SECRET, // Secret key stored in .env file
      { expiresIn: '1h' }     // Token valid for 1 hour
    );

    // Return authentication data to client
    return { 
      userId: user.id, 
      token: token, 
      tokenExpiration: 1 // 1 hour
    };
  }
};
