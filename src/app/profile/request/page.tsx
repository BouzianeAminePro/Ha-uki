"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo } from "react";
import { Invitation } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useInvitations } from "@/hooks/useInvitations";
import { cn } from "@/lib";
import { InvitationWithGameDetails } from "@/services/invitation.service";
import { useInvitation } from "@/hooks/useInvitation";
import { QueryKeys } from "@/consts/types";
import { useToast } from "@/components/ui/use-toast";
import Skeleton from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

const InvitationCard = dynamic(
  () => import("@/components/Invitation/InvitationCard/InvitationCard")
);

export default function Page() {
  const { data: session } = useSession();
  const { data = { records: [], count: 0 }, isPending } = useInvitations({
    isRequest: true,
    status: 'PENDING',
    gameUserId: session?.user?.id
  });

  const { updateInvitation } = useInvitation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const onRequestResponse = useCallback(
    async (id: string, status: 'APPROVED' | 'DENIED') => {
      await updateInvitation
        .mutateAsync({
          invitationId: id,
          data: {
            status: status,
          } as Invitation,
        })
        .then(() =>
          toast({
            title: "Information",
            description: `Request ${status.toLowerCase()} successfully`,
            variant: "default",
          })
        );
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.INVITATIONS],
      });
    },
    [updateInvitation, toast, queryClient]
  );

  console.log("records", data?.records)
  console.log("session", session?.user?.id)

  return (
    <div className={cn("flex flex-col w-full h-full p-5 md:p-0 gap-y-5")}>
      <div className={cn("scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0")}>
        Pending Join Requests
      </div>

      <div className={cn("text-xl text-muted-foreground")}>
        Manage pending requests to join your games.
      </div>

      {isPending ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      ) : data.records.length > 0 ? (
        data.records.map((request: InvitationWithGameDetails, index: number) => (
          <InvitationCard invitation={request} key={index}>
            {session?.user?.email === request.game.createdBy?.email && (
              <div className="flex gap-2 ml-auto">
                <Button onClick={() => onRequestResponse(request.id, 'APPROVED')} variant="default">Accept</Button>
                <Button onClick={() => onRequestResponse(request.id, 'DENIED')} variant="destructive">Reject</Button>
              </div>
            )}
          </InvitationCard>
        ))
      ) : (
        <div className="text-muted-foreground">
          No pending join requests for your games.
        </div>
      )}
    </div>
  );
}
