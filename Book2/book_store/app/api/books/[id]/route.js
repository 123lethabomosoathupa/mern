import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import Book from "../../../models/Book";
 
export const DELETE = async (request, { params }) => {
  await connectDB();
  const id = params.id;
 
  await Book.findByIdAndDelete(id);
 
  return new NextResponse(JSON.stringify({ "Book deleted": id }));
};