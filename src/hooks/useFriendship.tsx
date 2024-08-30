"use client";

import { useMemo, useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useQuery } from "@tanstack/react-query";

export function useFriendship(userId?: string) {
  const [params, setParams] = useState<any>({});

  const queryKey = useMemo(() => `friendship-${userId}`, [userId]);
  const {
    data = {} as AxiosResponse,
    isPending,
    error = {} as AxiosError,
    status,
  } = useQuery({
    queryKey: [queryKey],
    queryFn: async () =>
      userId
        ? await axios.get<AxiosResponse>(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/friendship?userId=${userId}`
          )
        : null,
  });

  return {
    data,
    isPending,
    error,
    status,
    params,
    setParams,
  };
}
