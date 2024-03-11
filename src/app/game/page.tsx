"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useState } from "react";

import { Game, Invitation } from "@prisma/client";
import { EnvelopeClosedIcon, PlusIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { User } from "next-auth";

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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
const GameForm = dynamic(() => import("@/components/Game/Forms/GameForm"));
const GameCard = dynamic(() => import("@/components/Game/GameCard/GameCard"));
const Skeleton = dynamic(() => import("@/components/ui/skeleton"));

export default function Page() {
  const [currentTab, setCurrentTab] = useState("My games");
  const { data: session } = useSession();

  const onTabChange = useCallback((tabName: string, params = {}) => {
    setCurrentTab(tabName);
    setParams(params);
  }, []);

  const { data: games, isPending, setParams } = useGames();

  const isGameOwnerOrInvited = useCallback(
    (gameId: string) => {
      return (session?.user as User & { Game: Game[] })?.Game?.some(
        (item) => item?.id === gameId
      );
    },
    [session?.user]
  );

  return (
    <div className={cn("flex flex-col gap-y-2")}>
      <div className={cn("ml-auto")}>
        <Sheet>
          <SheetTrigger>
            <Button size="icon">
              <PlusIcon />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className={cn("overflow-y-auto")}>
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
          <TabsTrigger value="My games" onClick={() => onTabChange("My games")}>
            My games
          </TabsTrigger>
          <TabsTrigger
            value="public"
            onClick={() => onTabChange("public", { public: true })}
          >
            Public
          </TabsTrigger>
        </TabsList>
        <TabsContent value={currentTab}>
          <div className={cn("flex flex-col gap-y-2 w-[300px]")}>
            {isPending ? (
              <div className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                <Skeleton className="h-[125px] w-[250px] rounded-xl" />
              </div>
            ) : (
              <>
                {games?.data?.records.length ? (
                  games?.data?.records?.map(
                    (
                      game: Game & { Invitation: Invitation[] },
                      index: number
                    ) => (
                      <div className={cn("flex flex-row")} key={index}>
                        <Link href={`/game/${game.id}`}>
                          <GameCard
                            {...game}
                            active={game.active}
                            acceptedInvitations={
                              game?.Invitation?.filter(
                                (invitation: Invitation) => invitation.answer
                              ).length ?? 0
                            }
                            maxPlayers={Number(game.maxPlayers)}
                            name={String(game.name ?? "Game")}
                            canRequest={
                              currentTab === "public" &&
                              !isGameOwnerOrInvited(game?.id)
                            }
                          />
                        </Link>
                        {currentTab === "public" &&
                        !isGameOwnerOrInvited(game?.id) ? (
                          <div>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger className="h-full">
                                  <Button
                                    onClick={console.log}
                                    className="flex h-full rounded-tl-none rounded-bl-none"
                                  >
                                    {/* if invitation is sent opened the enevlope icon */}
                                    <EnvelopeClosedIcon />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Request to join the game</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        ) : null}
                      </div>
                    )
                  )
                ) : (
                  <div className={cn("text-lg")}>No games to show</div>
                )}
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
