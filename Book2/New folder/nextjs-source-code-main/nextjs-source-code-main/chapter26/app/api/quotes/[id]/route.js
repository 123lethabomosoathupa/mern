import { NextResponse } from "next/server";
import quotes from '../data.json';

export async function DELETE(request, {params}) {
    const id = params.id;
    
    const index = quotes.findIndex((quote) => quote.id === id);
    if(index !== -1) {
        quotes.splice(index, 1);
    }
    
    return new NextResponse({"Book deleted": id});
}