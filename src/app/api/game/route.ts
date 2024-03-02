import { NextResponse, type NextRequest } from "next/server";

import { gameService, sessionService, transporter } from "@/services";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  let whereClause = {};
  searchParams.forEach((value: string, key) => {
    whereClause = { [key]: JSON.parse(value) };
  });

  if (!Object.keys(whereClause).includes("public")) {
    const user = await sessionService.getCurrentSessionUser();

    if (user) {
      whereClause = { ...whereClause, userId: user?.id };
    }
  }

  const games = await gameService.findAll(whereClause);

  return NextResponse.json({ records: games, count: games.length });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { invitations = [] } = body;
  delete body.invitations;

  const user = await sessionService.getCurrentSessionUser();

  // TODO make a field in invitation that the mail is sent so i can filter and don't send again an email
  invitations.forEach(
    async (invitation) =>
      await transporter.sendMail({
        to: invitation,
        subject: "test node_mailer",
        text: "Test invite",
      })
  );

  const game = await gameService.create({
    ...body,
    userId: user ? user?.id : null,
  });

  return NextResponse.json(game);
}
