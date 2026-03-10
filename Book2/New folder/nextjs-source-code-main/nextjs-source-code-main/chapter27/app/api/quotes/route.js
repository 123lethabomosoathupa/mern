import { prisma } from "../../db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET(req) {
  const quotes = await prisma.quote.findMany();
  console.log("GET books called");

  return NextResponse.json(quotes);
}

export async function POST(req) {
  const { quote, by } = await req.json();
  const newQuote = {
    id: uuidv4(),
    quote,
    by,
  };
  quotes.push(newQuote);

  return NextResponse.json("Quote added successfully");
}
