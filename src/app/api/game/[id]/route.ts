import { findById, remove, updateById } from "@/services/game.service";
import { getCurrentSessionUser } from "@/services/session.service";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(_, { params: { id } }) {
  if (!id) {
    return NextResponse.json(null, {
      status: 400,
      statusText: "This id mandotary for this request",
    });
  }

  const game = await findById(id);

  if (!game) {
    return NextResponse.json(null, {
      status: 404,
      statusText: `No game found with this id ${id}`,
    });
  }

  return NextResponse.json(game);
}

export async function DELETE(_, { params: { id } }) {
  if (!id) {
    return NextResponse.json(null, {
      status: 400,
      statusText: "This id mandotary for this request",
    });
  }

  const user = await getCurrentSessionUser();
  if (!user || user.Game.every((game) => game?.id !== id)) {
    return NextResponse.json(null, {
      status: 403,
      statusText: "You don't have the rights to update this game",
    });
  }

  const game = await findById(id);

  if (!game) {
    return NextResponse.json(null, {
      status: 404,
      statusText: `No game found with this id ${id}`,
    });
  }

  await remove(id);

  return NextResponse.json(game);
}

export async function PATCH(request: NextRequest, { params: { id } }) {
  try {
    const user = await getCurrentSessionUser();
    if (!user || user.Game.every((game) => game?.id !== id)) {
      return NextResponse.json(null, {
        status: 403,
        statusText: "You don't have the rights to update this game",
      });
    }

    const body = await request.json();
    const game = await updateById(body, id);
    return NextResponse.json(game);
  } catch (e) {
    return NextResponse.json(null, {
      status: 400,
      statusText: "Missing or wrong information",
    });
  }
}
