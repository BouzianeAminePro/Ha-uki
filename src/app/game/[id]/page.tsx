"use client";

import type { Game, Invitation } from "@prisma/client";
// import { PlusIcon } from "@radix-ui/react-icons";

import GameCard from "@/components/GameCard/GameCard";
import { cn } from "@/lib";
// import { Button } from "@/components/ui/button";
import Squad from "@/components/Squad/Squad";
import { UserInvitation } from "@/types";
import useGame from "@/hooks/useGame";
import { useMemo } from "react";

export default function Game({ params: { id } }: { params: { id: string } }) {
  const { data } = useGame(id);

  const game = useMemo(
    () => data?.data as Game & { Invitation: UserInvitation[] },
    [data]
  );

  const users = useMemo(
    () =>
      game?.Invitation?.map((invitation: UserInvitation) => ({
        invitationId: invitation.id,
        ...invitation.user,
        answer: invitation.answer,
        benchType: invitation.benchType,
      })),
    [game]
  );

  return (
    // TODO fix the mobile version
    <div className={cn("flex flex-col gap-y-5 w-full px-5 md:w-fit")}>
      <div className={cn("md:w-[300px] md:self-center")}>
        <GameCard
          id={game?.id}
          active={game?.active}
          acceptedInvitations={
            game?.Invitation?.filter(
              (invitation: Invitation) => invitation.answer
            ).length ?? 0
          }
          maxPlayers={Number(game?.maxPlayers ?? 0)}
          name={String(game?.name ?? "Game")}
        />
      </div>
      {/* TODO add sheet to invite a user by his mail */}
      {/* <Button size="icon" className={cn("ml-auto md:m-0")}>
        <PlusIcon />
      </Button> */}
      <Squad users={users ?? []} />
    </div>
  );
}
