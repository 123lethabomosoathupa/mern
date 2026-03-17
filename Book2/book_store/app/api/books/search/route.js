import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import Book from "../../../models/Book";
 
export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
 
  const filteredBooks = await Book.find({
    title: { $regex: query, $options: "i" },
  });
 
  return NextResponse.json(filteredBooks);
}