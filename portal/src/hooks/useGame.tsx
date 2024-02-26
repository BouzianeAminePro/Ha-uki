"use client";

import { useMemo } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";

export default function useGame(id?: string) {
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
    mutationFn: ({ gameId }: { gameId: string }) =>
      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/game/${gameId}`, {
        body: JSON.stringify({}),
        method: "POST",
      }),
  });

  return {
    data,
    isPending,
    error,
    status,
    createGame,
  };
}
