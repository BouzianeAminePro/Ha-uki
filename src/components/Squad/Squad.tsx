"use client";

import { useMemo } from "react";

import { BenchType } from "@prisma/client";

import { cn } from "@/lib";
import RosterRegistry from "./RosterRegistry";

export default function Squad({ users, isGameOwner, onUpdateSuccess }) {
  const officialSquad = useMemo(
    () => users?.filter(({ benchType }) => benchType === BenchType.OFFICIAL),
    [users]
  );

  const reserveSquad = useMemo(
    () => users?.filter(({ benchType }) => benchType === BenchType.RESERVE),
    [users]
  );

  const squad = useMemo(
    () => users?.filter(({ benchType }) => !benchType),
    [users]
  );

  return (
    <div className={cn("flex flex-col md:flex-row md:gap-x-5 gap-y-5")}>
      <RosterRegistry
        key={BenchType.OFFICIAL}
        roster={officialSquad}
        type={BenchType.OFFICIAL}
        isGameOwner={isGameOwner}
        onUpdateSuccess={onUpdateSuccess}
      />
      <RosterRegistry
        key={"Squad list"}
        roster={squad}
        title="Squad list"
        isGameOwner={isGameOwner}
        onUpdateSuccess={onUpdateSuccess}
      />
      <RosterRegistry
        roster={reserveSquad}
        key={BenchType.RESERVE}
        type={BenchType.RESERVE}
        isGameOwner={isGameOwner}
        onUpdateSuccess={onUpdateSuccess}
      />
    </div>
  );
}
