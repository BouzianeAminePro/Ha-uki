import { NextResponse, type NextRequest } from "next/server";

import { findUserByEmail } from "@/services/user.service";
import { create, findAll } from "@/services/invitation.service";
import { create as friendShipCreate, findOne as findFriendship } from "@/services/friendship.service";
import { sendMail } from "@/services/mailer.service";
import { content as newComerMailContent } from "@/mails/newComer";
import { getCurrentSessionUser } from "@/services/session.service";
import { PrismaClientInstance } from "@/lib";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  let whereClause = {};
  searchParams.forEach((value: string, key) => {
    whereClause = { [key]: JSON.parse(value) };
  });

  if (!Object.keys(whereClause).length) {
    const user = await getCurrentSessionUser();

    if (user) {
      whereClause = { ...whereClause, userId: user?.id };
    }
  }

  // Add condition to get only future or current day invitations
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  whereClause = {
    ...whereClause,
    game: {
      startDate: {
        gte: currentDate,
      },
    },
  };

  const invitations = await findAll(whereClause);

  return NextResponse.json({ records: invitations, count: invitations.length });
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const emails = (await request.json()) ?? [];
  const gameId = String(searchParams.get("gameId"));

  const currentUser = await getCurrentSessionUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const prisma = PrismaClientInstance.getInstance();

  await Promise.all(
    emails?.map(async (email: string) => {
      const user = await findUserByEmail(email);
      if (!user) {
        await sendMail(email, "Join us", newComerMailContent(gameId, email), true);
      } else {
        await sendMail(user.email, "Invitation", newComerMailContent(gameId, email), true);
        await create({
          emailSent: true,
          userId: user.id,
          gameId,
        });
        
        // Check if friendship already exists
        const existingFriendship = await findFriendship({
          OR: [
            { userId: currentUser.id, friendId: user.id },
            { userId: user.id, friendId: currentUser.id }
          ]
        });

        if (!existingFriendship) {
          await friendShipCreate({
            user: { connect: { id: currentUser.id } },
            friend: { connect: { id: user.id } },
          });
        }
      }
    })
  );

  return NextResponse.json({});
} 
