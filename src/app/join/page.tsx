import Link from "next/link";
import { redirect } from "next/navigation";

import { cn } from "@/lib";
import { Button } from "@/components/ui/button";
import { findById } from "@/services/game.service";
import * as userService from "@/services/user.service";
import { create, findByUserId } from "@/services/invitation.service";

export default async function Page({ searchParams }) {
  const searchParamsKeys = Object.keys(searchParams) ?? [];
  if (
    !searchParamsKeys.length ||
    !searchParamsKeys.includes("gameId") ||
    !searchParamsKeys.includes("email")
  ) {
    redirect("/");
  }
  try {
    const game = await findById(searchParams.gameId);
    if (!game) return redirect("/");

    const user = await userService.findUserByEmail(searchParams.email);

    if (!user) return redirect("/");

    const invitation = await findByUserId(user.id, game.id);

    if (invitation) return redirect("/game");

    await create({
      emailSent: true,
      gameId: searchParams.gameId,
      userId: user.id,
    });

    return redirect("/game");
  } catch (e) {}

  return (
    <div className={cn("flex flex-col items-center gap-y-2")}>
      <div className={cn("text-lg")}>
        This mail is subjected to you, so you can join our platform{" "}
        <Link
          href={`${process.env.SERVER_URL}`}
          className={cn("font-semibold tracking-tight underline")}
        >
          Ha'uki
        </Link>
        , someone who wants you to join a game send you this invitation
      </div>
      <Link href={`${process.env.SERVER_URL}/game`}>
        <Button>Join us & the game</Button>
      </Link>
    </div>
  );
}
