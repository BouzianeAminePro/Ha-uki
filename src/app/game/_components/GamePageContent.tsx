"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { Game, Invitation, User } from "@prisma/client";
import { useSession } from "next-auth/react";

import { cn } from "@/lib";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useGames from "@/hooks/useGames";
import { askInvitation } from "@/actions/askInvitation";
import { useToast } from "@/components/ui/use-toast";
import GameCard from "@/app/game/_components/GameCard/GameCard";
import Skeleton from "@/components/ui/skeleton";

export default function GameContent() {
    const [currentTab, setCurrentTab] = useState("My games");
    const { data: session } = useSession();
    const { toast } = useToast();

    const onTabChange = useCallback((tabName: string, params = {} as any) => {
        setCurrentTab(tabName);
        setParams(params);
    }, []);

    const { data: games, isPending, setParams, refetch } = useGames();

    const isGameOwnerOrInvited = useCallback(
        (game: Game & { Invitation: Array<Invitation> }) =>
            game?.userId === (session?.user as User)?.id ||
            game?.Invitation?.some(
                (invitation: Invitation) =>
                    invitation.userId === (session?.user as User)?.id
            ),
        [session?.user]
    );

    const isUserParticipating = useCallback(
        (game: Game & { Invitation: Array<Invitation> }) => {
            const now = new Date();
            const gameEnd = game.startDate && game.duration
                ? new Date(game.startDate.getTime() + game.duration * 60000)
                : null;
            
            return (
                isGameOwnerOrInvited(game) &&
                game.startDate &&
                gameEnd &&
                now >= game.startDate &&
                now <= gameEnd
            );
        },
        [isGameOwnerOrInvited]
    );

    return (
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
                                    (game: Game & { Invitation: Invitation[] }, index: number) => (
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
                                                        !isGameOwnerOrInvited(game)
                                                    }
                                                    onRequestJoin={async () => {
                                                        try {
                                                            await askInvitation(game.userId, game.id, session?.user?.email);
                                                            await refetch();
                                                            toast({
                                                                title: "Success",
                                                                description: "Request to join sent successfully",
                                                            });
                                                        } catch (error) {
                                                            toast({
                                                                title: "Error",
                                                                description: "Failed to send request",
                                                                variant: "destructive",
                                                            });
                                                        }
                                                    }}
                                                />
                                            </Link>
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
    );
}