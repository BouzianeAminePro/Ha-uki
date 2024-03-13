"use client";

import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { User } from "@prisma/client";

import Skeleton from "@/components/ui/skeleton";
import { cn } from "@/lib";
import useUser from "@/hooks/useUser";
import { useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const InformationForm = dynamic(
  () => import("@/components/Profile/Information/Forms/InformationForm")
);

export default function Page() {
  const { data: session, status } = useSession();
  const { updateUser } = useUser((session?.user as User)?.id);

  const { toast } = useToast();
  const { refresh } = useRouter();

  const onSubmit = useCallback(
    async (body) =>
      await updateUser.mutateAsync({ body }).then(() => {
        toast({
          title: "Information",
          description: "Information updated successfully",
        });
        setTimeout(() => refresh(), 550);
      }),
    []
  );

  return (
    <div className={cn("flex flex-col w-full h-full p-5 md:p-0 gap-y-5")}>
      <div
        className={cn(
          "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0"
        )}
      >
        General Information
      </div>
      <div className={cn("text-xl text-muted-foreground")}>
        This is how others will see you on the site.
      </div>
      {status !== "loading" && status === "authenticated" ? (
        <InformationForm user={session?.user as User} onSubmit={onSubmit} />
      ) : (
        <div className="flex flex-col gap-y-5">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      )}
    </div>
  );
}
