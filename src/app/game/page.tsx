"use client";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useState } from "react";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useGames from "@/hooks/useGames";
import { Button } from "@/components/ui/button";
const GameForm = dynamic(() => import("@/components/Game/Forms/GameForm"));
const GameCard = dynamic(() => import("@/components/Game/GameCard/GameCard"));
const Skeleton = dynamic(() => import("@/components/ui/skeleton"));

export default function Page() {
  const { data: games, isPending, setParams } = useGames();
  const { push } = useRouter();

  const [currentTab, setCurrentTab] = useState("My games");

  return (
    <div className={cn("flex flex-col gap-y-2")}>
      <div className={cn("ml-auto")}>
        <Sheet>
          <SheetTrigger>
            <Button size="icon">
              <PlusIcon />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Game information</SheetTitle>
            </SheetHeader>
            <GameForm>
              <SheetClose>
                <Button type="submit">Confirm</Button>
              </SheetClose>
            </GameForm>
          </SheetContent>
        </Sheet>
      </div>
      <Tabs defaultValue={currentTab} className="w-[300px]">
        <TabsList>
          <TabsTrigger
            value="My games"
            onClick={() => {
              setCurrentTab("My games");
              setParams({});
            }}
          >
            My games
          </TabsTrigger>
          <TabsTrigger
            value="public"
            onClick={() => {
              setCurrentTab("public");
              setParams({ public: true });
            }}
          >
            Public
          </TabsTrigger>
        </TabsList>
        <TabsContent value={currentTab}>
          <div className={cn("flex flex-col gap-y-2 w-[300px]")}>
            {isPending ? (
              <div
                className="flex flex-col space-y-3"
                suppressHydrationWarning={true}
              >
                <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                <Skeleton className="h-[125px] w-[250px] rounded-xl" />
              </div>
            ) : (
              <>
                {games?.data?.records?.map(
                  (
                    game: Game & { Invitation: Invitation[] },
                    index: number
                  ) => (
                    <div
                      onClick={() => push(`/game/${game.id}`)}
                      className={cn("cursor-pointer")}
                      key={index}
                    >
                      <GameCard
                        active={game.active}
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
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
