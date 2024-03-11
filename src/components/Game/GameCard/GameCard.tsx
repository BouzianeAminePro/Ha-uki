"use client";

import { useMemo, useState } from "react";
import { Game } from "@prisma/client";

import { cn } from "@/lib";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusSymbol from "@/components/StatusSymbol/StatusSymbol";
import { Badge } from "@/components/ui/badge";

export default function GameCard({
  maxPlayers = 0,
  acceptedInvitations = 0,
  active,
  name = "Game",
  canRequest = false,
  ...rest
}: {
  maxPlayers: number;
  acceptedInvitations: number;
  active: boolean | null;
  name: string;
  canRequest?: boolean;
}) {
  const [game] = useState<Game>(rest as Game);

  const dateWithTime = useMemo(() => {
    if (!game.startDate) return null;
    const startDate = new Date(game.startDate);
    return `${startDate.toLocaleString()}`;
  }, [game]);

  return (
    <Card
      className={cn(`${canRequest ? "rounded-tr-none rounded-br-none" : ""}`)}
    >
      <CardHeader>
        <CardTitle className={cn("flex")}>
          <span className={cn("dark:text-muted-foreground")}>{name}</span>
          <div className={cn("flex flex-row gap-x-2  items-center ml-auto")}>
            <Badge>
              {acceptedInvitations}/{maxPlayers}
            </Badge>
            <StatusSymbol status={active} />
          </div>
        </CardTitle>
      </CardHeader>
      {dateWithTime || game.duration ? (
        <CardContent className={cn("flex flex-row gap-x-2")}>
          {dateWithTime ? (
            <span className={cn("dark:text-muted-foreground")}>
              {dateWithTime}
            </span>
          ) : null}
          {game.duration ? (
            <Badge
              className={cn("ml-auto")}
              variant="secondary"
            >{`${game.duration}min`}</Badge>
          ) : null}
        </CardContent>
      ) : null}
    </Card>
  );
}
