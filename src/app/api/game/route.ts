import { NextResponse, type NextRequest } from "next/server";

import { sendMail } from "@/services/mailer.service";
import { getCurrentSessionUser } from "@/services/session.service";
import { create, findAll } from "@/services/game.service";
import * as invitationService from "@/services/invitation.service";
import { findUserByEmail } from "@/services/user.service";
import { create as friendShipCreate } from "@/services/friendship.service";

import { content } from "@/mails/newComer";
import { PrismaClientInstance } from "@/lib";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  let whereClause = {};
  searchParams.forEach((value: string, key) => {
    whereClause = { [key]: JSON.parse(value) };
  });

  if (!Object.keys(whereClause).includes("public")) {
    const user = await getCurrentSessionUser();

    if (user) {
      whereClause = { ...whereClause, userId: user?.id };
    }
  }

  const games = await findAll(whereClause);

  return NextResponse.json({ records: games, count: games.length });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { invitations = [], ...gameData } = body;

  const currentUser = await getCurrentSessionUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const game = await create({
    ...gameData,
    userId: currentUser.id,
  });

  const prisma = PrismaClientInstance.getInstance();

  await Promise.all(
    invitations.map(async (email: string) => {
      const invitedUser = await findUserByEmail(email);
      if (!invitedUser) {
        await sendMail(email, "Join us", content(game.id, email), true);
      } else {
        await sendMail(email, "Invitation", content(game.id, email), true);
        await invitationService.create({
          emailSent: true,
          userId: invitedUser.id,
          gameId: game.id,
        });

        // Create friendship for both users
        await friendShipCreate({
          user: { connect: { id: currentUser.id } },
          friend: { connect: { id: invitedUser.id } },
        });
        await friendShipCreate({
          user: { connect: { id: invitedUser.id } },
          friend: { connect: { id: currentUser.id } },
        });
      }
    })
  );

  return NextResponse.json(game);
}
