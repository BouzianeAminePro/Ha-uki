"use client";

import { useMemo } from "react";
import { cn } from "@/lib";

export default function StatusSymbol({ status }) {
  const statusSymbolColor = useMemo<string>(
    () =>
      status
        ? "bg-emerald-800"
        : status == false
        ? "bg-red-800"
        : "bg-amber-800",
    [status]
  );
  return (
    <span className={cn(`flex h-2 w-2 rounded-full ${statusSymbolColor}`)} />
  );
}
