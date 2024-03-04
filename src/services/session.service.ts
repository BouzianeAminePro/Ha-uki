import { getServerSession } from "next-auth";

import { UserWithGames, findUserByEmail } from "./user.service";

export async function getCurrentSessionUser(): Promise<
  UserWithGames | null | false
> {
  const session = await getServerSession();
  if (!session) return null;

  return await findUserByEmail(session?.user?.email);
}
