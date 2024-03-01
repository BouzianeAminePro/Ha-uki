"use client";

import { useRouter } from "next/navigation";

import { Game, Invitation } from "@prisma/client";
import { PlusIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import GameCard from "@/components/Game/GameCard/GameCard";
import useGames from "@/hooks/useGames";
import { Button } from "@/components/ui/button";
import GameForm from "@/components/Game/Forms/GameForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  const { data: games, isPending } = useGames();
  const { push } = useRouter();

  if (isPending) {
    return (
      <div className="flex flex-col space-y-3" suppressHydrationWarning={true}>
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-y-2")}>
      <div className={cn("ml-auto")}>
        <Sheet>
          <SheetTrigger>
            <Button size="icon">
              <PlusIcon />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom">
            <SheetHeader>
              <SheetTitle>Game information</SheetTitle>
              <GameForm>
                <SheetClose>
                  <Button type="submit">Confirm</Button>
                </SheetClose>
              </GameForm>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
      <div className={cn("flex flex-col gap-y-2 w-[300px]")}>
        {games?.data?.records?.map(
          (game: Game & { Invitation: Invitation[] }, index: number) => (
            <div
              onClick={() => push(`/game/${game.id}`)}
              className={cn("cursor-pointer")}
              key={index}
            >
              <GameCard
                active={Boolean(game.active)}
                acceptedInvitations={
                  game?.Invitation?.filter(
                    (invitation: Invitation) => invitation.answer
                  ).length ?? 0
                }
                maxPlayers={Number(game.maxPlayers)}
                name={String(game.name ?? "Game")}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
}
