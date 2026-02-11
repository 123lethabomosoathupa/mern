// Import mongoose to define schemas and interact with MongoDB
import mongoose from 'mongoose';

// Define the schema (structure) for a Book document
const bookSchema = mongoose.Schema(
  {
    // Title of the book
    title: {
      type: String,      // Data type
      required: true,    // Field must be provided
    },

    // Author of the book
    author: {
      type: String,
      required: true,
    },

    // Year the book was published
    publishYear: {
      type: Number,
      required: true,
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// Create a Book model based on the schema
// This represents the "books" collection in MongoDB
export const Book = mongoose.model('Book', bookSchema);
