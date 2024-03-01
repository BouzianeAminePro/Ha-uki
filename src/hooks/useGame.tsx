"use client";

import { useMemo } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { QueryKeys } from "@/consts";

export default function useGame(id?: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const queryKey = useMemo(() => `game-${id}`, [id]);
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
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/game/${id}`
          )
        : null,
  });

  const createGame = useMutation({
    mutationFn: (body) =>
      axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/game`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GAMES],
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
    createGame,
  };
}
