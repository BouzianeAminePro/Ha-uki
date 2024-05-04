import { NextResponse, type NextRequest } from "next/server";

import { findUserByEmail } from "@/services/user.service";
import { create, findAll } from "@/services/invitation.service";
import { sendMail } from "@/services/mailer.service";
import { content as newComerMailContent } from "@/mails/newComer";
import { getCurrentSessionUser } from "@/services/session.service";

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

  const invitations = await findAll(whereClause);

  return NextResponse.json({ records: invitations, count: invitations.length });
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const emails = (await request.json()) ?? [];
  const gameId = String(searchParams.get("gameId"));

  Promise.all(
    emails?.flatMap(async (email: string) => {
      const user = await findUserByEmail(email);
      if (!user) {
        return sendMail(email, "Join us", newComerMailContent(gameId, email), true);
      } else {
        return [
          sendMail(user?.email, "Invitation", newComerMailContent(gameId, email), true),
          create({
            emailSent: true,
            userId: user?.id,
            gameId,
          }),
        ];
      }
    })
  );

  return NextResponse.json({});
}
