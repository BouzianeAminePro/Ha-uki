"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

import type { Game, Invitation } from "@prisma/client";
import { PlusIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib";
const GameCard = dynamic(() => import("@/components/Game/GameCard/GameCard"));
const Squad = dynamic(() => import("@/components/Squad/Squad"));
const Skeleton = dynamic(() => import("@/components/ui/skeleton"));
const InvitationForm = dynamic(
  () => import("@/components/Invitation/Forms/InvitationForm")
);

import useGame from "@/hooks/useGame";
import { UserInvitation } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Game({ params: { id } }: { params: { id: string } }) {
  const { data, isPending } = useGame(id);

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

  if (isPending) {
    return (
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-y-5 w-full px-5 md:w-fit")}>
      <div className={cn("md:w-[300px] md:self-center")}>
        <GameCard
          {...game}
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
      <div className={cn("ml-auto")}>
        <Sheet>
          <SheetTrigger>
            <Button size="icon">
              <PlusIcon />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Invitations:</SheetTitle>
            </SheetHeader>
            <InvitationForm gameId={id}>
              <SheetClose>
                <Button type="submit">Confirm</Button>
              </SheetClose>
            </InvitationForm>
          </SheetContent>
        </Sheet>
      </div>
      <Squad users={users ?? []} />
    </div>
  );
}
