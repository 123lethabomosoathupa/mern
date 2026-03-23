// Import Next.js response helper for sending responses
import { NextResponse } from "next/server";

// Import MongoDB connection function
import connectDB from "../../lib/mongodb";

// Import Book model (schema for books collection)
import Book from "../../models/Book";


// =======================
// GET ALL BOOKS
// =======================
export async function GET(req) {
  // Connect to the database
  await connectDB();

  // Fetch all books from the database
  const books = await Book.find({});

  // Return books as JSON response
  return NextResponse.json(books);
}


// =======================
// ADD A NEW BOOK
// =======================
export async function POST(req) {
  // Connect to the database
  await connectDB();

  // Extract data from request body (sent from frontend)
  const { title, link, img } = await req.json();

  // Create a new book document in MongoDB
  const newBook = await Book.create({
    title,
    link,
    img,
  });

  // Return success message
  return NextResponse.json("Book added successfully");
}