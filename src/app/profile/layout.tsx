"use client";

import { ReactNode } from "react";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col justify-evenly md:flex-row">
      <div className="flex flex-col md:flex-row p-5 md:gap-x-9 md:items-center">
        <NavigationMenu>
          <NavigationMenuList className="flex md:flex-col items-baseline gap-3">
            <div className="text-lg font-bold" style={{ marginBottom: 5 }}>
              Menu
            </div>
            <Separator orientation="horizontal" className="hidden md:block" />
            <NavigationMenuItem className="cursor-pointer md:hover:underline underline md:no-underline">
              <Link href="/profile/information" legacyBehavior passHref>
                General information
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem className="cursor-pointer md:hover:underline underline md:no-underline">
              <Link href="/profile/game" legacyBehavior passHref>
                Games
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem className="cursor-pointer md:hover:underline underline md:no-underline">
              <Link href="/profile/invitation" legacyBehavior passHref>
                Invitations
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div>{children}</div>
      </div>
      {/* to space evenly */}
      <div></div>
    </div>
  );
}
