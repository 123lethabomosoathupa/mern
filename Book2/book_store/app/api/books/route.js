import books from "./data.json";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
 
export async function GET(req) {
  return NextResponse.json(books);
}
 
export async function POST(req) {
  const { title, link, img } = await req.json();
 
  const newBook = {
    id: uuidv4(),
    title,
    link,
    img,
  };
 
  books.push(newBook);
  return NextResponse.json("Book added successfully");
}