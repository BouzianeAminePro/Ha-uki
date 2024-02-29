import { NextResponse, type NextRequest } from "next/server";

import { gameService, sessionService, transporter } from "@/services";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  let whereClause = {};
  searchParams.forEach((value: string, key) => {
    whereClause = { [key]: JSON.parse(value) };
  });

  const user = await sessionService.getCurrentSessionUser();

  if (user) {
    whereClause = { ...whereClause, userId: user?.id };
  }

  const games = await gameService.findAll(whereClause);

  return NextResponse.json({ records: games, count: games.length });
}

export async function POST(request: NextRequest) {
  // TODO it does work, you should use it on post (create game) and patch game/:id when invitation part is updated
  await transporter.sendMail({
    to: process.env.GMAIL_APP_MAIL,
    subject: "test node_mailer",
    text: "Test invite",
  });

  return NextResponse.json({});
}
