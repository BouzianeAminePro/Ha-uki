import { NextResponse, type NextRequest } from "next/server";

import { findUserByEmail } from "@/services/user.service";
import { create } from "@/services/invitation.service";
import { sendMail } from "@/services/mailer.service";
import { content } from "@/mails/newComer";

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const emails = (await request.json()) ?? [];
  const gameId = searchParams.get("gameId");

  Promise.all(
    emails?.map(async (email: string) => {
      const user = await findUserByEmail(email);
      if (!user) {
        // TODO send new user the email to join plus the query params for the gameId
        return sendMail(email, "Invitation", content, true);
      } else {
        return Promise.all([
          sendMail(user?.email, "invitation", "Invite text"),
          create({
            emailSent: true,
            userId: user?.id,
            gameId,
          }),
        ]);
      }
    })
  );

  return NextResponse.json({});
}
