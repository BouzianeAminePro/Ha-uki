"use client";

import { useMemo } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/consts/types";

export default function useGame(id?: string) {
  const queryClient = useQueryClient();

  const queryKey = useMemo(() => `game-${id}`, [id]);
  const {
    data = {} as AxiosResponse,
    isPending,
    error = {} as AxiosError,
    status,
    refetch,
  } = useQuery({
    queryKey: [queryKey],
    queryFn: async () =>
      await axios.get<AxiosResponse>(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/game/${id}`
      ),
  });

  const deleteGame = useMutation({
    mutationFn: async () =>
      await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/game/${id}`
      ),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GAMES],
      });
    },
  });

  return {
    data,
    isPending,
    error,
    status,
    deleteGame,
    refetch,
  };
}
