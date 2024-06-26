"use client";

import { useMemo, useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Invitation } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";

export function useInvitation(id?: string) {
  const [params, setParams] = useState<any>({});

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const queryKey = useMemo(() => `invitation-${id}`, [id]);
  const {
    data = {} as AxiosResponse,
    isPending,
    error = {} as AxiosError,
    status,
  } = useQuery({
    queryKey: [queryKey],
    queryFn: async () =>
      id
        ? await axios.get<AxiosResponse>(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/invitation/${id}`
          )
        : null,
  });

  const updateInvitation = useMutation({
    mutationFn: async ({
      invitationId,
      data,
    }: {
      invitationId: string;
      data: Invitation;
    }) =>
      await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/invitation/${invitationId}`,
        data
      ),
    onSuccess: (response) =>
      queryClient.invalidateQueries({
        queryKey: [`game-${response?.data?.gameId}`],
      }),
  });

  const deleteInvitation = useMutation({
    mutationFn: async ({ invitationId }: { invitationId: string }) =>
      await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/invitation/${invitationId}`
      ),
  });

  const createInvitation = useMutation({
    mutationFn: async ({ data }: { data: any }) =>
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/invitation`,
        data,
        { params }
      ),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [`game-${params.gameId}`],
      });
      toast({
        title: "Information",
        description: "Information updated successfully",
        variant: "default",
      });
    },
  });

  return {
    data,
    isPending,
    error,
    status,
    updateInvitation,
    createInvitation,
    deleteInvitation,
    params,
    setParams,
  };
}
