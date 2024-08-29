"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useSession } from "next-auth/react";
import { PlusIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import Skeleton from "@/components/ui/skeleton";

const GameContent = dynamic(() => import("./_components/GamePageContent"), {
  ssr: false,
  loading: () => <LoadingFallback />,
});

const GameForm = dynamic(() => import("./_components/Forms/GameForm"), {
  ssr: false,
  loading: () => <LoadingFallback />,
});

const LoadingFallback = () => (
  <div className="flex flex-col space-y-3">
    <Skeleton className="h-[125px] w-[250px] rounded-xl" />
    <Skeleton className="h-[125px] w-[250px] rounded-xl" />
    <Skeleton className="h-[125px] w-[250px] rounded-xl" />
    <Skeleton className="h-[125px] w-[250px] rounded-xl" />
  </div>
);

export default function Page() {
  const { status } = useSession();

  if (status === "loading") {
    return <LoadingFallback />;
  }

  return (
    <div className={cn("flex flex-col gap-y-2")}>
      <div className={cn("ml-auto")}>
        <Sheet>
          <SheetTrigger>
            <Button size="icon">
              <PlusIcon />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className={cn("overflow-y-auto")}>
            <SheetHeader>
              <SheetTitle>Game information</SheetTitle>
            </SheetHeader>
            <GameForm>
              <SheetClose>
                <Button type="submit">Confirm</Button>
              </SheetClose>
            </GameForm>
          </SheetContent>
        </Sheet>
      </div>
      <Suspense fallback={<LoadingFallback />}>
        <GameContent />
      </Suspense>
    </div>
  );
}
