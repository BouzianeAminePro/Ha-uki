import { NextResponse, type NextRequest } from "next/server";

import { findUserByEmail } from "@/services/user.service";
import { create } from "@/services/invitation.service";
import { sendMail } from "@/services/mailer.service";

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const emails = (await request.json()) ?? [];
  const gameId = searchParams.get("gameId");

  emails?.forEach(async (email: string) => {
    const user = await findUserByEmail(email);
    if (!user) {
      // TODO send new user the email to join plus the query params for the gameId
      await sendMail(
        email,
        "Invitation",
        `<a target="_blank" href="${process.env.SERVER_URL}/api/auth/signin">invitation link</a>`,
        true
      );
    } else {
      await sendMail(user?.email, "invitation", "Invite text");
      await create({
        emailSent: true,
        userId: user?.id,
        gameId,
      });
    }
  });

  return NextResponse.json({});
}
