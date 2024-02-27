import { PrismaClientInstance } from "@/lib";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(_, { params: { id } }) {
  const prismaClient = PrismaClientInstance.getInstance();

  if (!id) {
    return NextResponse.json(null, {
      status: 400,
      statusText: "This id mandotary for this request",
    });
  }

  const game = await prismaClient.game.findUnique({
    where: { id },
    include: {
      Invitation: {
        include: {
          user: {
            select: {
              email: true,
              image: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!game) {
    return NextResponse.json(null, {
      status: 404,
      statusText: `No game found with this id ${id}`,
    });
  }

  return NextResponse.json(game);
}

export async function POST(request: NextRequest, { params: { id } }) {
  const body = await request.json();

  const prismaClient = PrismaClientInstance.getInstance();

  if (!id)
    return NextResponse.json(
      { message: "This id mandotary for this request" },
      { status: 400 }
    );

  let game = await prismaClient.game.findUnique({ where: { id } });

  if (game) {
    return NextResponse.redirect(
      new URL(`/game/${game?.id}`, process.env.SERVER_URL)
    );
  }

  try {
    game = await prismaClient.game.create({
      data: body,
    });
    return NextResponse.json(game);
  } catch (e) {
    return NextResponse.json(null, {
      status: 400,
      statusText: "Missing or wrong information",
    });
  }
}
