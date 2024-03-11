import { PrismaClientInstance } from "@/lib";
import { getCurrentSessionUser } from "@/services/session.service";
import { type NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, { params: { id } }) {
    const body = await request.json();
    const prismaClient = PrismaClientInstance.getInstance();
  
    if (!id)
      return NextResponse.json(
        { message: "This id mandotary for this request" },
        { status: 400 }
      );
  
    let user = await prismaClient.user.findUnique({
      where: { id },
    });
  
    if (!user) {
      return NextResponse.json(null, {
        status: 404,
        statusText: `No user found with this id ${id}`,
      });
    }
  
    const sessionUser = await getCurrentSessionUser();
    if (!sessionUser || sessionUser?.id !== id ) {
      return NextResponse.json(null, {
        status: 403,
        statusText: "You don't have the rights to update this user",
      });
    }
    
    delete body?.Game;
    delete body?.updatedAt;

    user = await prismaClient.user.update({
      where: {
        id,
      },
      data: body
    });
  
    return NextResponse.json(user);
  }
  