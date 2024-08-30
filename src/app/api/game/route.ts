import { NextResponse, type NextRequest } from "next/server";

import { sendMail } from "@/services/mailer.service";
import { getCurrentSessionUser } from "@/services/session.service";
import { create, findAll } from "@/services/game.service";
import * as invitationService from "@/services/invitation.service";
import { findUserByEmail } from "@/services/user.service";
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

  const user = await getCurrentSessionUser();

  const game = await create({
    ...gameData,
    userId: user ? user?.id : null,
  });

  const invitedUsers = await Promise.all(
    invitations.map(async (email: string) => {
      const invitedUser = await findUserByEmail(email);
      if (!invitedUser) {
        await sendMail(email, "Join us", content(game.id, email), true);
        return null;
      } else {
        await sendMail(email, "test node_mailer", "Test invite");
        await invitationService.create({
          emailSent: true,
          userId: invitedUser.id,
          gameId: game.id,
        });
        return invitedUser;
      }
    })
  );

  // Add invited users to the creator's friends list
  if (user) {
    const prisma = PrismaClientInstance.getInstance();
    const newFriends = invitedUsers.filter((u): u is any => u !== null);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        friends: {
          connect: newFriends.map(friend => ({ id: friend.id })),
        },
      },
    });
  }

  return NextResponse.json(game);
}
