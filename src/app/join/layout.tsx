"use client";

import { ReactNode } from "react";

import { cn } from "@/lib/utils";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className={cn("h-[90vh] w-full flex items-center justify-center")}>
      <div className={cn("h-[25vh] flex flex-col items-center text-center")}>
        {children}
      </div>
    </div>
  );
}
