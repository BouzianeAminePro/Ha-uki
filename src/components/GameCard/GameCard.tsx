"use client";
import { useRouter } from "next/navigation";

import { cn } from "@/lib";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusSymbol from "../StatusSymbol/StatusSymbol";

export default function GameCard({
  id,
  maxPlayers = 0,
  acceptedInvitations = 0,
  active,
  name = "Game",
}: {
  id?: string;
  maxPlayers: number;
  acceptedInvitations: number;
  active: boolean | null;
  name: string;
}) {
  const { push } = useRouter();
  return (
    <Card onClick={() => push(`/game/${id}`)}>
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
