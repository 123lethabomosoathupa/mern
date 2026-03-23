// Import Next.js response helper
import { NextResponse } from "next/server";

// Import database connection function
import connectDB from "../../../lib/mongodb";

// Import Book model (MongoDB schema)
import Book from "../../../models/Book";

// Handle GET requests (API endpoint)
export async function GET(req) {
  // Connect to MongoDB database
  await connectDB();

  // Extract query parameters from the request URL
  const { searchParams } = new URL(req.url);

  // Get the "query" value from the URL (?query=something)
  const query = searchParams.get("query");

  // Find books where the title matches the query (case-insensitive)
  const filteredBooks = await Book.find({
    title: { 
      $regex: query, // Search using pattern matching
      $options: "i"  // "i" makes it case-insensitive
    },
  });

  // Return the filtered books as JSON response
  return NextResponse.json(filteredBooks);
}