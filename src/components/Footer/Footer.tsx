"use client";

import Link from "next/link";

import { cn } from "../../lib";
import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";

export default function Footer() {
  return (
    <div
      className={cn(
        "fixed bottom-0 flex items-center justify-around bg-slate-100 dark:bg-zinc-900 w-full h-[5rem]"
      )}
    >
      <h4 className={cn("scroll-m-20 text-sm font-semibold tracking-tight")}>
        @2024 Kabla labs. All rights reserved
      </h4>
      <div className={cn("flex items-center gap-x-2")}>
        <Link
          target="_blank"
          href="https://www.linkedin.com/in/amine-bouziane-747790127"
        >
          <LinkedInLogoIcon />
        </Link>
        <Link target="_blank" href="https://github.com/BouzianeAminePro">
          <GitHubLogoIcon />
        </Link>
      </div>
    </div>
  );
}
