import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className={cn("h-screen w-full flex justify-center")}>
      {children}
    </div>
  );
}
