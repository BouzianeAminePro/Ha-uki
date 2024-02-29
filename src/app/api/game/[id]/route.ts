import { gameService } from "@/services";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(_, { params: { id } }) {
  if (!id) {
    return NextResponse.json(null, {
      status: 400,
      statusText: "This id mandotary for this request",
    });
  }

  const game = await gameService.findById(id);

  if (!game) {
    return NextResponse.json(null, {
      status: 404,
      statusText: `No game found with this id ${id}`,
    });
  }

  return NextResponse.json(game);
}

export async function PATCH(request: NextRequest, { params: { id } }) {
  try {
    const body = await request.json();
    const game = await gameService.updateById(body, id);
    return NextResponse.json(game);
  } catch (e) {
    return NextResponse.json(null, {
      status: 400,
      statusText: "Missing or wrong information",
    });
  }
}
