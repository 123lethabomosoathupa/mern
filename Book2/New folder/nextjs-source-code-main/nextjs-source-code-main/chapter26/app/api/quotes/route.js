import quotes from './data.json';
import { NextResponse } from 'next/server';
import {v4 as uuidv4} from 'uuid';

export async function GET(req) {
    return NextResponse.json(quotes);
};

export async function POST(req) {
    const {quote, by} = await req.json();
    const newQuote = {
        id: uuidv4(),
        quote,
        by
    };
    quotes.push(newQuote);

    return NextResponse.json("Quote added successfully");
}