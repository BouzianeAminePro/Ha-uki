"use client";

import { Game, Invitation } from "@prisma/client";
import { PlusIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib";
import GameCard from "@/components/GameCard/GameCard";
import useGames from "@/hooks/useGames";
import { Button } from "@/components/ui/button";

export default function Page() {
  const { data: games } = useGames();
  return (
    <div className={cn("flex flex-col gap-y-2")}>
      <Button size="icon" className={cn("ml-auto")}>
        <PlusIcon />
      </Button>
      <div className={cn("flex flex-col gap-y-2 w-[300px]")}>
        {games?.data?.records?.map(
          (game: Game & { Invitation: Invitation[] }, index: number) => (
            <GameCard
              key={index}
              id={game.id}
              active={Boolean(game.active)}
              acceptedInvitations={
                game?.Invitation?.filter(
                  (invitation: Invitation) => invitation.answer
                ).length ?? 0
              }
              maxPlayers={Number(game.maxPlayers)}
              name={String(game.name ?? "Game")}
            />
          )
        )}
      </div>
    </div>
  );
}
