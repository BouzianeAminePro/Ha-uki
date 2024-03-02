import { getServerSession } from "next-auth";

import { userService } from ".";
import { UserWithGames } from "./user.service";

export async function getCurrentSessionUser(): Promise<
  UserWithGames | null | false
> {
  const session = await getServerSession();
  if (!session) return null;

  return await userService.findUserByEmail(session?.user?.email);
}
