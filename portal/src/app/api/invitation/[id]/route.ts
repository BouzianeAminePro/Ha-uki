import { NextResponse, type NextRequest } from "next/server";
import { PrismaClientInstance } from "@/lib";

export async function GET() {}

export async function PATCH(request: NextRequest, { params: { id } }) {
  const body = await request.json();
  const prismaClient = PrismaClientInstance.getInstance();

  if (!id)
    return NextResponse.json(
      { message: "This id mandotary for this request" },
      { status: 400 }
    );

  let invitation = await prismaClient.invitation.findUnique({
    where: { id },
  });

  if (!invitation) {
    return NextResponse.json(null, {
      status: 404,
      statusText: `No invitation found with this id ${id}`,
    });
  }

  invitation = await prismaClient.invitation.update({
    where: {
      id,
    },
    data: {
      // ...invitation,
      ...body,
    },
  });

  return NextResponse.json(invitation);
}
