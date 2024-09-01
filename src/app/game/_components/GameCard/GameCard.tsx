"use client";

import { useMemo, useState } from "react";
import { Game } from "@prisma/client";

import { cn } from "@/lib";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusSymbol from "@/components/StatusSymbol/StatusSymbol";
import { Badge } from "@/components/ui/badge";
import { EnvelopeClosedIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export default function GameCard({
  maxPlayers = 0,
  acceptedInvitations = 0,
  active,
  name = "Game",
  canRequest = false,
  onRequestJoin,
  ...rest
}: {
  maxPlayers: number;
  acceptedInvitations: number;
  active: boolean | null;
  name: string;
  canRequest?: boolean;
  onRequestJoin?: () => void;
}) {
  const [game] = useState<Game>(rest as Game);

  const dateWithTime = useMemo(() => {
    if (!game.startDate) return null;
    const startDate = new Date(game.startDate);
    return `${startDate.toLocaleString()}`;
  }, [game]);

  return (
    <div className={cn("flex flex-row")}>
      <Card
        className={cn(`flex-grow ${canRequest ? "rounded-tr-none rounded-br-none" : ""}`)}
      >
        <CardHeader>
          <CardTitle className={cn("flex")}>
            <span className={cn("dark:text-muted-foreground w-[11ch]")}>{name}</span>
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
      {canRequest && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onRequestJoin}
                className="h-auto rounded-tl-none rounded-bl-none"
                variant="outline"
              >
                <EnvelopeClosedIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Request to join the game</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
