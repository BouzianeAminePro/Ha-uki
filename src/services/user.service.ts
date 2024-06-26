import { User } from "next-auth";

import { PrismaClientInstance } from "@/lib";

const prismaClient = PrismaClientInstance.getInstance();

export async function findUserByEmail(email?: string | null) {
  if (!email) return false;

  return await prismaClient.user.findUnique({
    where: {
      email,
    },
    include: {
      Game: {
        where: {
          OR: [
            {
              createdBy: {
                email,
              },
            },
            {
              Invitation: {
                some: {
                  user: {
                    email,
                  },
                },
              },
            },
          ],
        },
        select: {
          id: true,
          Invitation: {
            select: {
              id: true,
              validInvitation: true,
            }
          }
        },
      },
    },
  });
}

export async function findUserById(id?: string | null) {
  if (!id) return false;

  return await prismaClient.user.findUnique({
    where: {
      id,
    },
    include: {
      Game: {
        where: {
          OR: [
            {
              createdBy: {
                id,
              },
            },
            {
              Invitation: {
                some: {
                  user: {
                    id,
                  },
                },
              },
            },
          ],
        },
        select: {
          id: true,
        },
      },
    },
  });
}

export type UserWithGames = ReturnType<typeof findUserByEmail>;

export async function create(user?: Partial<User> | null) {
  const userExists = await findUserByEmail(user?.email);
  if (userExists) {
    return Promise.reject("User with this email already exists");
  }

  return await prismaClient.user.create({
    data: {
      email: user?.email,
      image: user?.image,
    },
  });
}
