"use client";

import { useMemo } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useQuery } from "@tanstack/react-query";

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
      await axios.get<AxiosResponse>(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/game/${id}`
      ),
  });

  return {
    data,
    isPending,
    error,
    status,
  };
}
