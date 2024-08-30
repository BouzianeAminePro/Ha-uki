"use client";

import dynamic from "next/dynamic";
import { useCallback } from "react";

import { Invitation } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";

import { useInvitations } from "@/hooks/useInvitations";
import { cn } from "@/lib";
import { InvitationWithGameDetails } from "@/services/invitation.service";
import { Switch } from "@/components/ui/switch";
import { useInvitation } from "@/hooks/useInvitation";
import { QueryKeys } from "@/consts/types";
import { useToast } from "@/components/ui/use-toast";
import Skeleton from "@/components/ui/skeleton";

const InvitationCard = dynamic(
  () => import("@/components/Invitation/InvitationCard/InvitationCard")
);

export default function Page() {
  const { data = { records: [], count: 0 }, isPending } = useInvitations();
  const { updateInvitation } = useInvitation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const onInvitationAnswerChange = useCallback(
    async (id: string, checked: boolean) => {
      await updateInvitation
        .mutateAsync({
          invitationId: id,
          data: {
            answer: checked,
          } as Invitation,
        })
        .then(() =>
          toast({
            title: "Information",
            description: "Information updated successfully",
            variant: "default",
          })
        );
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.INVITATIONS],
      });
    },
    []
  );
  return (
    <div className={cn("flex flex-col w-full h-full p-5 md:p-0 gap-y-5")}>
      <div
        className={cn(
          "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0"
        )}
      >
        Invitations
      </div>
      <div className={cn("text-xl text-muted-foreground")}>
        This is where you can accept/decline invitations.
      </div>
      {isPending ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      ) : (
        !!data?.records?.length ? data?.records?.map(
          (invitation: InvitationWithGameDetails, index: number) => (
            <InvitationCard invitation={invitation} key={index}>
              {/* Action */}
              <Switch
                className={cn("ml-auto")}
                checked={Boolean(invitation.answer)}
                onCheckedChange={(value) =>
                  onInvitationAnswerChange(invitation.id, value)
                }
              />
            </InvitationCard>
          )
        ) : (
          <div className="text-muted-foreground">
            No invitations found.
          </div>
        )
      )}
    </div>
  );
}
