import { NextResponse, type NextRequest } from "next/server";

import { sendMail } from "@/services/mailer.service";
import { getCurrentSessionUser } from "@/services/session.service";
import { create, findAll } from "@/services/game.service";
import * as invitationService from "@/services/invitation.service";
import { findUserByEmail } from "@/services/user.service";
import { content } from "@/mails/newComer";

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

  const user = await getCurrentSessionUser();

  const game = await create({
    ...gameData,
    userId: user ? user?.id : null,
  });

  await Promise.all(
    invitations.flatMap(async (email: string) => {
      const user = await findUserByEmail(email);
      if (!user) {
        return sendMail(email, "Join us", content(game.id, email), true);
      } else {
        return [
          sendMail(email, "test node_mailer", "Test invite"),
          invitationService.create({
              emailSent: true,
              userId: user?.id,
              gameId: game?.id,
          })
        ]
      }
    })
  );

  return NextResponse.json(game);
}
