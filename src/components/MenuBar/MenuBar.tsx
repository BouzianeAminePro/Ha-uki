"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useMemo } from "react";

import { EnterIcon, ExitIcon, HomeIcon } from "@radix-ui/react-icons";
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
  const { push } = useRouter();
  const pathname = usePathname();

  const isShowCasePage = useMemo(() => pathname === "/", [pathname]);

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
                    <Avatar>
                      <AvatarImage src={session?.user?.image ?? ""} width={5} />
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="min-w-[20px]">
                    {isShowCasePage ? (
                      <DropdownMenuItem onClick={() => push("/game")}>
                        <HomeIcon />
                      </DropdownMenuItem>
                    ) : (
                      <></>
                    )}
                    <DropdownMenuItem
                      onClick={() => signOut({ callbackUrl: "/" })}
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
