import { Game, Invitation } from "@prisma/client";
import { PrismaClientInstance } from "@/lib";

const prismaClient = PrismaClientInstance.getInstance();

export async function findAll(whereClause) {
  let orClause;
  if ("userId" in whereClause) {
    orClause = {
      userId: whereClause?.userId
    }
  }

  return await prismaClient.invitation.findMany({
    where: {
      ...orClause,
      ...whereClause,
    },
    select: {
      id: true,
      answer: true,
      benchType: true,
      game: {
        select: {
          id: true,
          duration: true,
          startDate: true,
          name: true,
          createdBy: {
            select: {
              name: true,
              email: true,
              image: true
            }
          }
        }
      }
    }
  });
}

export type InvitationWithGameDetails = Invitation & {game: Game}

export async function create(invitationData: Partial<Invitation>) {
  return await prismaClient.invitation.create({
    data: invitationData,
  });
}
