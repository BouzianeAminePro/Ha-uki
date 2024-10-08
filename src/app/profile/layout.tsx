"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { name: "General information", href: "/profile/information" },
    { name: "Invitations", href: "/profile/invitation" },
    { name: "Requests", href: "/profile/request" },
  ];

  return (
    <div className="flex flex-col w-[100%] md:justify-center max-w-7xl mx-auto px-4 py-4 md:py-8">
      <div className="flex flex-col w-[100%] md:flex-row md:justify-evenly">
        <aside className="mb-4 md:mb-0 flex-0">
          <nav className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-1 overflow-x-auto">
            {tabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap",
                  pathname === tab.href
                    ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                )}
              >
                {tab.name}
              </Link>
            ))}
          </nav>
        </aside>
        <Separator orientation="vertical" className="hidden md:block" />
        <main className="flex-[.5]">
          {children}
        </main>
      </div>
    </div>
  );
}
