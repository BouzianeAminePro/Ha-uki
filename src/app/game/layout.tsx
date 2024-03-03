"use client";

import { ReactNode } from "react";

import { cn } from "@/lib/utils";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className={cn(
        "h-full w-full flex flex-col items-center justify-center gap-y-5 mb-2"
      )}
    >
      <Breadcrumbs />
      {children}
    </div>
  );
}
