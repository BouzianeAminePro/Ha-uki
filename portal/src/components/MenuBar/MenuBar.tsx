"use client";

import Image from "next/image";
import Link from "next/link";

import { EnterIcon, ExitIcon } from "@radix-ui/react-icons";
import { signIn, signOut, useSession } from "next-auth/react";

import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { ModeToggle } from "../ui/theme-toggler";

export default function MenuBar() {
  const { status } = useSession();
  return (
    <div className={cn("flex flex-row m-2 md:justify-around")}>
      <Link href="/" className={cn("flex flex-row items-center")}>
        <Image
          src="/portal/images/logo/logo-black&white.svg"
          width={50}
          height={50}
          alt="logo"
          className={cn("dark:invert")}
          priority={false}
        />
        <span className={cn("text-sm text-muted-foreground")}>Sportify</span>
      </Link>

      {/* auth and theme toggle */}
      <div className={cn("ml-auto md:ml-0")}>
        <div className={cn("flex flex-row gap-x-2")}>
          {status !== "loading" ? (
            status === "unauthenticated" ? (
              <Button
                variant="outline"
                size="icon"
                onClick={() => signIn("", { callbackUrl: `/${process.env.NEXT_PUBLIC_BASE_PATH}/game` })}
              >
                <EnterIcon />
              </Button>
            ) : (
              <Button
                variant="outline"
                size="icon"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <ExitIcon />
              </Button>
            )
          ) : (
            <></>
          )}
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
