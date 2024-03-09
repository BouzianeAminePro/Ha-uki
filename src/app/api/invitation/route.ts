import { NextResponse, type NextRequest } from "next/server";

import { findUserByEmail } from "@/services/user.service";
import { create, findAll } from "@/services/invitation.service";
import { sendMail } from "@/services/mailer.service";
import { content } from "@/mails/newComer";
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
  const gameId = searchParams.get("gameId");

  Promise.all(
    emails?.flatMap(async (email: string) => {
      const user = await findUserByEmail(email);
      if (!user) {
        // TODO send new user the email to join plus the query params for the gameId
        return sendMail(email, "Invitation", content, true);
      } else {
        return [
          sendMail(user?.email, "invitation", "Invite text"),
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
