import { prisma } from "../../db";
import { NextResponse } from "next/server";

export async function GET(req) {
  const quotes = await prisma.quote.findMany();
  console.log("GET quotes called");

  return NextResponse.json(quotes);
}

export async function POST(req) {
  const { quote, by } = await req.json();

  const newQuote = await prisma.quote.create({
    data: {
      quote,
      by,
    },
  });

  return NextResponse.json(newQuote);
}
