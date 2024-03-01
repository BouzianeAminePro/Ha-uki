"use client";

import { cn } from "@/lib";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusSymbol from "@/components/StatusSymbol/StatusSymbol";

export default function GameCard({
  maxPlayers = 0,
  acceptedInvitations = 0,
  active,
  name = "Game",
}: {
  maxPlayers: number;
  acceptedInvitations: number;
  active: boolean | null;
  name: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("flex")}>
          <span>
            {acceptedInvitations}/{maxPlayers}
          </span>
          <div className={cn("ml-auto")}>
            <StatusSymbol status={active} />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <span>{name}</span>
      </CardContent>
    </Card>
  );
}
