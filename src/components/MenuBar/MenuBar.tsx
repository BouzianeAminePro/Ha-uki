"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useMemo } from "react";

import {
  AvatarIcon,
  EnterIcon,
  ExitIcon,
  GearIcon,
  HomeIcon,
} from "@radix-ui/react-icons";
import { signIn, signOut, useSession } from "next-auth/react";

import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { ModeToggle } from "../ui/theme-toggler";
import { Avatar, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function MenuBar() {
  const pathname = usePathname();

  const isShowCasePage = useMemo(() => pathname === "/", [pathname]);
  const isProfilePage = useMemo(
    () => pathname.includes("/profile"),
    [pathname]
  );

  const { status, data: session } = useSession();

  return (
    <div className={cn("flex flex-row m-2 md:justify-around")}>
      <Link href="/" className={cn("flex flex-row items-center")}>
        <Image
          src="/images/logo/logo-black&white.svg"
          width={50}
          height={50}
          alt="logo"
          className={cn("dark:invert")}
          priority={false}
        />
        <span className={cn("text-sm text-muted-foreground")}>{"ha'uki"}</span>
      </Link>

      {/* auth and theme toggle */}
      <div className={cn("ml-auto md:ml-0")}>
        <div className={cn("flex flex-row gap-x-2")}>
          <ModeToggle />
          {status === "loading" ? (
            <></>
          ) : (
            <>
              {status === "unauthenticated" ? (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => signIn("", { callbackUrl: `/game` })}
                >
                  <EnterIcon />
                </Button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    {session?.user?.image ? (
                      <Avatar>
                        <AvatarImage src={session?.user?.image ?? ""} />
                      </Avatar>
                    ) : (
                      <Button variant="outline" size="icon">
                        <AvatarIcon />
                      </Button>
                    )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="min-w-[20px]">
                    {isShowCasePage ? (
                      <Link href="/game">
                        <DropdownMenuItem className={cn("cursor-pointer")}>
                          <HomeIcon />
                        </DropdownMenuItem>
                      </Link>
                    ) : (
                      <></>
                    )}
                    <Link
                      href={isProfilePage ? "/game" : "/profile/information"}
                    >
                      <DropdownMenuItem className={cn("cursor-pointer")}>
                        {isProfilePage ? <HomeIcon /> : <GearIcon />}
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className={cn("cursor-pointer")}
                    >
                      <ExitIcon />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
