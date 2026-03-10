import { NextResponse } from "next/server";
import quotes from "../data.json";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');

  const filteredQuotes = quotes.filter((quote) => {
    return quote.quote.toLowerCase().includes(query.toLowerCase());
  });

  return NextResponse.json(filteredQuotes);
};
