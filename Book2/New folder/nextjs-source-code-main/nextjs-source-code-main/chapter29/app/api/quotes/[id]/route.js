import { NextResponse } from "next/server";

export async function DELETE(request, {params}) {
    const id = params.id;
    await prisma.quote.delete({where: {id: id}});
    
    return new NextResponse({"Book deleted": id});
}