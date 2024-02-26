"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { EnterIcon } from "@radix-ui/react-icons";

import { Button } from "../ui/button";
import { cn } from "../../lib";
import { ModeToggle } from "../ui/theme-toggler";

export default function MenuBar() {
  const { push } = useRouter();
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
        <span className={cn("text-sm text-muted-foreground")}>Sportify</span>
      </Link>

      {/* auth and theme toggle */}
      <div className={cn("ml-auto md:ml-0")}>
        <div className={cn("flex flex-row gap-x-2")}>
          <Button variant="outline" size="icon">
            <Link href={`${process.env.NEXT_PUBLIC_PORTAL_URL}`}>
              <EnterIcon />
            </Link>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
