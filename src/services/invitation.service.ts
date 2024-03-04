import { Invitation } from "@prisma/client";
import { PrismaClientInstance } from "@/lib";

const prismaClient = PrismaClientInstance.getInstance();

export async function create(invitationData: Partial<Invitation>) {
  return await prismaClient.invitation.create({
    data: invitationData,
  });
}
