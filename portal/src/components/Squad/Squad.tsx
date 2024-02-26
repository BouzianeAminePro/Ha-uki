"use client";

import { useMemo } from "react";

import { BenchType } from "@prisma/client";

import { cn } from "@/lib";
import RosterRegistry from "./RosterRegistry";

export default function Squad({ users }) {
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
      <RosterRegistry roster={officialSquad} type={BenchType.OFFICIAL} />
      <RosterRegistry roster={squad} />
      <RosterRegistry roster={reserveSquad} type={BenchType.RESERVE} />
    </div>
  );
}
