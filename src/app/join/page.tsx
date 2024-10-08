import Link from "next/link";
import { redirect } from "next/navigation";

import { cn } from "@/lib";
import { Button } from "@/components/ui/button";
import * as gameService from "@/services/game.service";
import * as userService from "@/services/user.service";
import * as invitationService from "@/services/invitation.service";
import * as friendshipService from "@/services/friendship.service";

export const dynamic='force-dynamic';

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { gameId, email } = searchParams;

  if (!gameId || !email || typeof gameId !== 'string' || typeof email !== 'string') {
    redirect("/");
  }

  const game = await gameService.findById(gameId);
  if (!game) redirect("/");

  const user = await userService.findUserByEmail(email);
  if (!user) redirect("/");

  const invitation = await invitationService.findByUserId(user.id, game.id);
  if (invitation) redirect("/game");

  const newInvitation = await invitationService.create({
    emailSent: true,
    gameId: game.id,
    userId: user.id,
  });

  const gameCreator = await userService.findUserById(game.userId);
  if (gameCreator) {
    await friendshipService.create({
      user: { connect: { id: gameCreator.id } },
      friend: { connect: { id: user.id } },
    });
    await friendshipService.create({
      user: { connect: { id: user.id } },
      friend: { connect: { id: gameCreator.id } },
    });
  }

  if (!newInvitation) redirect("/");

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
      {!!newInvitation && (
        <Link href={`${process.env.SERVER_URL}/game/${game.id}`}>
          <Button>Join us & the game</Button>
        </Link>
      )}
    </div>
  );
}
