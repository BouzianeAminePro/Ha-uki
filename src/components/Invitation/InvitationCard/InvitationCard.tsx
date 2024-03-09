"use client";

import Link from "next/link";
import { ReactNode, useCallback } from "react";

const StatusSymbol = dynamic(
  () => import("@/components/StatusSymbol/StatusSymbol")
);
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib";
import { InvitationWithGameDetails } from "@/services/invitation.service";
import { CaretSortIcon, Link1Icon } from "@radix-ui/react-icons";
import dynamic from "next/dynamic";

export default function InvitationCard({
  invitation,
  children,
}: {
  invitation: InvitationWithGameDetails;
  children: ReactNode;
}) {
  const dateWithTime = useCallback((game) => {
    if (!game.startDate) return null;
    const startDate = new Date(game.startDate);
    return `${startDate.toLocaleString()}`;
  }, []);

  return (
    <div className={cn("flex flex-row items-center md:gap-x-10")}>
      <Collapsible>
        <CollapsibleTrigger
          className={cn("flex flex-row items-center gap-x-1")}
        >
          <StatusSymbol status={invitation.game.active} />
          <div className={cn("dark:text-muted-foreground")}>
            {invitation?.game?.name}
          </div>
          <Button variant="ghost" size="sm" className={cn("w-9 p-0 ml-auto")}>
            <CaretSortIcon className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className={cn("flex flex-col gap-y-2")}>
          <div className={cn("rounded-md border px-4 py-3")}>
            <div className={cn("flex flex-row gap-x-2")}>
              {invitation?.game?.startDate ? (
                <div className={cn("dark:text-muted-foreground text-sm")}>
                  {dateWithTime(invitation.game)}
                </div>
              ) : null}
              {invitation.game.duration ? (
                <Badge variant="secondary">{`${invitation.game.duration}min`}</Badge>
              ) : null}
            </div>
            <Link
              href={`/game/${invitation?.game?.id}`}
              className={cn("flex items-center gap-x-2 text-sm underline")}
            >
              {/* <Link1Icon /> */}
              {invitation?.game?.id}
            </Link>
          </div>
        </CollapsibleContent>
      </Collapsible>
      {/* Action section */}
      <div className={cn("ml-auto")}>{children}</div>
    </div>
  );
}
