"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";

import { ChevronRightIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib";

export default function Breadcrumbs() {
  const pathname = usePathname();

  const pathSegments = useMemo(
    () => pathname?.split("/")?.filter((segment) => segment !== ""),
    [pathname]
  );

  const capitalizeFirstLetter = useCallback((string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }, []);

  return pathSegments.length === 1 ? (
    <></>
  ) : (
    <nav>
      <ul className={cn("flex flex-row gap-x-1")}>
        {pathSegments.map((segment, index) => (
          <li key={index} className={cn("flex flex-row items-center")}>
            {pathSegments.length - 1 === index ? (
              capitalizeFirstLetter(segment)
            ) : (
              <Link
                href={`/${pathSegments.slice(0, index + 1).join("/")}`}
                className={cn("underline")}
              >
                {capitalizeFirstLetter(segment)}
              </Link>
            )}
            {pathSegments.length - 1 === index ? <></> : <ChevronRightIcon />}
          </li>
        ))}
      </ul>
    </nav>
  );
}
