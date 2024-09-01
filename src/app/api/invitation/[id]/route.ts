import { NextResponse, type NextRequest } from "next/server";
import { PrismaClientInstance } from "@/lib";
import { getCurrentSessionUser } from "@/services/session.service";
import * as invitationService from "@/services/invitation.service";
import * as gameService from "@/services/game.service";
import { sendMail } from "@/services/mailer.service";
import { findUserById } from "@/services/user.service";

export async function PATCH(request: NextRequest, { params: { id } }) {
  const body = await request.json();

  if (!id)
    return NextResponse.json(
      { message: "The id is mandotary for this request" },
      { status: 400 }
    );

  const invitation = await invitationService.findById(id);

  if (!invitation) {
    return NextResponse.json(null, {
      status: 404,
      statusText: `No invitation found with this id ${id}`,
    });
  }

  const user = await getCurrentSessionUser();

  if (!user) {
    return NextResponse.json(null, {
      status: 401,
      statusText: "An active session is mandatory for this request",
    });
  }

  // Check if the user is the requester
  if (user.id === invitation.userId) {
    // Requester can only update the answer field
    if (Object.keys(body).length !== 1 || !body.hasOwnProperty('answer')) {
      return NextResponse.json(null, {
        status: 403,
        statusText: "Requester can only update the answer field",
      });
    }
    await invitationService.updateById(id, { answer: body.answer });
    return NextResponse.json({ message: "Answer updated successfully" });
  }

  // For game owner, continue with existing logic
  const game = await gameService.findById(invitation.gameId);
  if (!game || (game.userId !== user.id)) {
    return NextResponse.json(null, {
      status: 403,
      statusText: "Only the owner of the game can update this invitation",
    });
  }

  const originalStatus = invitation.status;

  await invitationService.updateById(id, body);

  // Check if the status has changed
  if (body.status && body.status !== originalStatus) {
    const requester = await findUserById(invitation.userId);
    if (!requester) {
      return NextResponse.json(null, {
        status: 500,
        statusText: "The requester of this invitation doesn't exists",
      });
    }
    // Send email to the requester
    await sendMail(
      requester.email,
      "Invitation Status Update",
      `The status of your invitation to the ${game.name} game, has been updated to: ${body.status}`,
    );

    if (body.status === "DENIED") {
      await invitationService.deleteById(id);
      return NextResponse.json({ message: "Invitation rejected and deleted" });
    }
  }

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