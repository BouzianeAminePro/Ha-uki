import { getServerSession } from "next-auth";
import { User } from "@prisma/client";
import { userService } from ".";

export async function getCurrentSessionUser(): Promise<User | null | false> {
  const session = await getServerSession();
  if (!session) return null;

  return await userService.findUserByEmail(session?.user?.email);
}
