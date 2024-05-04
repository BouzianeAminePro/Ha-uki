"use client";

import { useCallback } from "react";
import { useDrop } from "react-dnd";
import { BenchType, Invitation } from "@prisma/client";

import Player from "./Player";
import { useInvitation } from "@/hooks/useInvitation";
import { cn } from "@/lib";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { TrashIcon } from "@radix-ui/react-icons";
import { useToast } from "../ui/use-toast";

export default function RosterRegistry({
  roster,
  title,
  type = null,
  isGameOwner = false,
  onUpdateSuccess,
}: {
  roster;
  title?: string;
  type?: BenchType | null;
  isGameOwner;
  onUpdateSuccess;
}) {
  const { updateInvitation, deleteInvitation } = useInvitation();
  const { toast } = useToast();
  const [{}, drop] = useDrop(
    () => ({
      accept: "player",
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
      drop: async (player: any) =>
        await updateInvitation.mutateAsync({
          invitationId: player.invitationId,
          data: {
            benchType: type,
          } as Invitation,
        }),
    }),
    [type]
  );

  const onDelete = useCallback(
    async (player) => {
      await deleteInvitation.mutateAsync({
        invitationId: player.invitationId,
      });
      onUpdateSuccess && await onUpdateSuccess();
      toast({
        title: "Information",
        description: "Invitation deleted successfuly",
      });
    },
    [toast, deleteInvitation]
  );

  return (
    <div className={cn("md:w-[350px]")} ref={drop}>
      <Card>
        <CardHeader>
          <CardTitle>{title ?? `${type} squad`}</CardTitle>
        </CardHeader>
        <CardContent className={cn("flex flex-col gap-y-3 w-full h-full")}>
          {roster?.map(
            ({ image, name, answer, email, ...player }, index: number) => (
              <div className="flex flex-row gap-x-4">
                <Player
                  key={index}
                  image={image}
                  name={name}
                  answer={answer}
                  email={email}
                  {...player}
                />
                {isGameOwner && (
                  <Button
                    className="ml-auto"
                    size="icon"
                    onClick={async () => await onDelete(player)}
                  >
                    <TrashIcon />
                  </Button>
                )}
              </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
