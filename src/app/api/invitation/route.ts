import { NextResponse, type NextRequest } from "next/server";

import { findUserByEmail } from "@/services/user.service";
import { create, findAll } from "@/services/invitation.service";
import { create as friendShipCreate } from "@/services/friendship.service";
import { sendMail } from "@/services/mailer.service";
import { content as newComerMailContent } from "@/mails/newComer";
import { getCurrentSessionUser } from "@/services/session.service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  let whereClause: any = {};
  
  // Add filters for non-relational fields
  const filterFields = ['id', 'answer', 'emailSent', 'benchType', 'validInvitation', 'gameId', 'userId', 'isRequest', 'status'];
  
  filterFields.forEach((field) => {
    const value = searchParams.get(field);
    if (value !== null) {
      whereClause[field] = field === 'answer' || field === 'emailSent' || field === 'validInvitation' || field === 'isRequest'
        ? value === 'true'
        : field === 'benchType' || field === 'status'
          ? value
          : field === 'id' || field === 'gameId' || field === 'userId'
            ? value
            : JSON.parse(value);
    }
  });

  // Keep existing user filter
  if (!Object.keys(whereClause).length) {
    const user = await getCurrentSessionUser();
    if (user) {
      whereClause.userId = user.id;
    }
  }

  // Keep existing date filter
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  whereClause.game = {
    startDate: {
      gte: currentDate,
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
        
        // Create friendship for both users
        await friendShipCreate({
          user: { connect: { id: currentUser.id } },
          friend: { connect: { id: user.id } },
        });
        await friendShipCreate({
          user: { connect: { id: user.id } },
          friend: { connect: { id: currentUser.id } },
        });
      }
    })
  );

  return NextResponse.json({});
}
