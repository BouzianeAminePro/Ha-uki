import { PrismaClientInstance } from "@/lib";
import { Prisma } from "@prisma/client";

const prismaClient = PrismaClientInstance.getInstance();

export async function create(friendshipData: Prisma.FriendshipCreateInput) {
  return await prismaClient.friendship.create({
    data: friendshipData,
  });
}

export async function getFriends(userId: string) {
  return await prismaClient.friendship.findMany({
    where: {
      OR: [
        { userId: userId },
        { friendId: userId }
      ]
    },
    include: {
      user: true,
      friend: true
    }
  });
}

export async function findOne(where: Prisma.FriendshipWhereInput) {
  return await prismaClient.friendship.findFirst({
    where,
    include: {
      user: true,
      friend: true
    }
  });
}

export type FriendsResult = Awaited<ReturnType<typeof getFriends>>;
