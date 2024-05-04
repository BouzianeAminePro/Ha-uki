import { NextResponse, type NextRequest } from "next/server";
import { PrismaClientInstance } from "@/lib";
import { getCurrentSessionUser } from "@/services/session.service";
import * as invitationService from "@/services/invitation.service";
import * as gameService from "@/services/game.service";

export async function PATCH(request: NextRequest, { params: { id } }) {
  const body = await request.json();
  const prismaClient = PrismaClientInstance.getInstance();

  if (!id)
    return NextResponse.json(
      { message: "The id is mandotary for this request" },
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

export async function DELETE(request: NextRequest, { params: { id } }) {
  if (!id)
    return NextResponse.json(
      { message: "The id is mandotary for this request" },
      { status: 400 }
    );
  
  const user = await getCurrentSessionUser();
  
  if (!user) {
    return NextResponse.json(
      { message: "An actif session is mandotary for this request" },
      { status: 401 }
    );
  }

  const invitation = await invitationService.findById(id);

  if (!invitation) {
    return NextResponse.json(
      { message: "Not found" },
      { status: 404 }
    );
  }

  const game = await gameService.findById(invitation?.gameId);

  if (!game) {
    return NextResponse.json(
      { message: "The game attached to this invitation no longer exist" },
      { status: 400 }
    );
  }

  if (game.userId !== user?.id) {
    return NextResponse.json(
      { message: "Only the owner of the game, can perform this kind of action" },
      { status: 403 }
    );
  }

  await invitationService.deleteById(id);

  return NextResponse.json({});
}