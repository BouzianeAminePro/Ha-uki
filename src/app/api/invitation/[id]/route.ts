import { NextResponse, type NextRequest } from "next/server";
import { PrismaClientInstance } from "@/lib";
import { getCurrentSessionUser } from "@/services/session.service";

export async function PATCH(request: NextRequest, { params: { id } }) {
  const body = await request.json();
  const prismaClient = PrismaClientInstance.getInstance();

  if (!id)
    return NextResponse.json(
      { message: "This id mandotary for this request" },
      { status: 400 }
    );

  let invitation = await prismaClient.invitation.findUnique({
    where: { id },
  });

  if (!invitation) {
    return NextResponse.json(null, {
      status: 404,
      statusText: `No invitation found with this id ${id}`,
    });
  }

  if (Object.keys(body).length > 1 || !Object.keys(body).includes('answer')) {  
    const user = await getCurrentSessionUser();
    if (!user || user.Game.every((game) => game?.id !== invitation?.gameId)) {
      return NextResponse.json(null, {
        status: 403,
        statusText: "You don't have the rights to update this game",
      });
    }
  }

  invitation = await prismaClient.invitation.update({
    where: {
      id,
    },
    data: body,
  });

  return NextResponse.json(invitation);
}
