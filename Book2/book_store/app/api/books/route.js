import { NextResponse } from "next/server";
import connectDB from "../../lib/mongodb";
import Book from "../../models/Book";
 
export async function GET(req) {
  await connectDB();
  const books = await Book.find({});
  return NextResponse.json(books);
}
 
export async function POST(req) {
  await connectDB();
  const { title, link, img } = await req.json();
 
  const newBook = await Book.create({
    title,
    link,
    img,
  });
 
  return NextResponse.json("Book added successfully");
}