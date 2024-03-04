import { NextResponse, type NextRequest } from "next/server";

import { sendMail } from "@/services/mailer.service";
import { getCurrentSessionUser } from "@/services/session.service";
import { create, findAll } from "@/services/game.service";
import * as invitationService from "@/services/invitation.service";
import { findUserByEmail } from "@/services/user.service";

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

  if (user) {
    await Promise.all(
      invitations.map(async (email: string) => {
        await sendMail(email, "test node_mailer", "Test invite");
        const userByEmail = await findUserByEmail(email);
        if (userByEmail) {
          await invitationService.create({
            emailSent: true,
            userId: userByEmail?.id,
            gameId: game?.id,
          });
        }
      })
    );
  }

  return NextResponse.json(game);
}
