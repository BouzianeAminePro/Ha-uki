"use client";

import { useDrop } from "react-dnd";

import { BenchType, Invitation } from "@prisma/client";

import Player from "./Player";
import { useInvitation } from "@/hooks/useInvitation";
import { cn } from "@/lib";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function RosterRegistry({
  roster,
  title,
  type = null,
}: {
  roster;
  title?: string;
  type?: BenchType | null;
}) {
  const { updateInvitation } = useInvitation();
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

  return (
    <div className={cn("md:w-[300px]")} ref={drop}>
      <Card>
        <CardHeader>
          <CardTitle>{title ?? `${type} squad`}</CardTitle>
        </CardHeader>
        <CardContent className={cn("flex flex-col gap-y-3 w-full h-full")}>
          {roster?.map(
            ({ image, name, answer, email, ...player }, index: number) => (
              <Player
                key={index}
                image={image}
                name={name}
                answer={answer}
                email={email}
                {...player}
              />
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
