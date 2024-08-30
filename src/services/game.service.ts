import { Game } from "@prisma/client";

import { PrismaClientInstance } from "@/lib";

const prismaClient = PrismaClientInstance.getInstance();

export async function create(body: Game) {
  return await prismaClient.game.create({
    data: {
      ...body,
    },
  });
}

export async function remove(id: string) {
  return await prismaClient.game.delete({
    where: { id },
  });
}

export async function findAll(whereClause) {
  let orClause;
  if ("userId" in whereClause) {
    orClause = {
      OR: [
        { userId: whereClause?.userId },
        {
          Invitation: {
            some: {
              userId: whereClause?.userId,
            },
          },
        },
      ],
    };

    delete whereClause?.userId;
  }

  const now = new Date();

  return await prismaClient.game.findMany({
    where: {
      ...orClause,
      ...whereClause,
      startDate: {
        gte: now,
      },
    },
    include: {
      Invitation: {
        where: {
          userId: whereClause?.userId,
        },
        select: {
          answer: true,
          validInvitation: true,
          userId: true
        },
      },
    },
  });
}

export async function findById(id?: string | null) {
  if (!id) return null;

  return await prismaClient.game.findUnique({
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
}

export async function updateById(body, id?: string | null) {
  if (!id) return null;

  return await prismaClient.game.update({
    data: body,
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
}
