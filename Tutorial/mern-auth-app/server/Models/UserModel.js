const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define user schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Your email address is required"],
    unique: true,  // Ensure email is unique in database
  },
  username: {
    type: String,
    required: [true, "Your username is required"],
  },
  password: {
    type: String,
    required: [true, "Your password is required"],
  },
  createdAt: {
    type: Date,
    default: new Date(),  // Automatically set creation date
  },
});

// Middleware to hash password before saving user
// This runs automatically before .save() is called
userSchema.pre("save", async function () {
  // Hash password with salt rounds of 12
  this.password = await bcrypt.hash(this.password, 12);
});

// Export User model
module.exports = mongoose.model("User", userSchema);