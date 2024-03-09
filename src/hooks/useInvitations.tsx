"use client";

import axios, { AxiosError, AxiosResponse } from "axios";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/consts/types";

export function useInvitations() {
  const {
    data = {} as AxiosResponse,
    isPending,
    error = {} as AxiosError,
    status,
  } = useQuery({
    queryKey: [QueryKeys.INVITATIONS],
    queryFn: async () =>
      await axios
        .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/invitation`)
        .then((response: AxiosResponse) => response.data),
  });

  return {
    data,
    isPending,
    error,
    status,
  };
}
