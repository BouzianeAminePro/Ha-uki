import { PrismaClientInstance } from "@/lib";
import { transporter } from "@/services";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  let whereClause = {};
  searchParams.forEach((value: string, key) => {
    whereClause = { [key]: JSON.parse(value) };
  });

  // TODO so i can get the games of the current session user (use inviation for that)
  // TODO middleware would intercept and set sesion user each time on the request
  const prismaClient = PrismaClientInstance.getInstance();
  const games = await prismaClient.game.findMany({
    where: whereClause,
    include: {
      Invitation: {
        select: {
          answer: true,
        },
      },
    },
  });

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
