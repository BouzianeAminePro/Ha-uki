"use client";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useCallback, useMemo } from "react";

import type { Game, Invitation } from "@prisma/client";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { PlusIcon, TrashIcon } from "@radix-ui/react-icons";

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const { data, isPending, deleteGame, refetch } = useGame(id);

  const { toast } = useToast();
  const { data: session } = useSession();

  const { push } = useRouter();

  const isGameOwner = useMemo(
    () =>
      (session?.user as User & { Game: Game[] })?.Game?.some(
        (item) => item?.id === id
      ),
    [session?.user, id]
  );

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

  const onDeleteGame = useCallback(async () => {
    await deleteGame.mutateAsync();
    push("/game");
    toast({
      title: "Information",
      description: "Game deleted successfuly",
    });
  }, []);

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
      {isGameOwner && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className={cn("ml-auto")} size="icon">
              <TrashIcon />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will permannently delete this game.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDeleteGame}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

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
      {isGameOwner && (
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
              <InvitationForm gameId={id} onSuccess={refetch}>
                <SheetClose>
                  <Button type="submit">Confirm</Button>
                </SheetClose>
              </InvitationForm>
            </SheetContent>
          </Sheet>
        </div>
      )}
      <Squad
        users={users ?? []}
        isGameOwner={isGameOwner}
        onUpdateSuccess={refetch}
      />
    </div>
  );
}
