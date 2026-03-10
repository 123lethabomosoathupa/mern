import { NextResponse } from "next/server";
import { prisma } from "../../../db";

//filtering through quotes using keywords
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');

  const filteredQuotes = await prisma.quote.findMany({
    where: {
      quote: {
        contains: query
      }
    }
  });

  return NextResponse.json(filteredQuotes);
};

//creating a new quote
export async function POST(req) {
  const {quote, by} = await req.json();
  const newQuote = {
    id: quotes.length + 1,
    quote,
    by
  };  
  quotes.push(newQuote);

  return NextResponse.json("Quote added successfully");
};