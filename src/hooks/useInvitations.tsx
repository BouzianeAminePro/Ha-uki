"use client";

import axios, { AxiosError, AxiosResponse } from "axios";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/consts/types";

interface InvitationFilters {
  isRequest?: boolean;
  status?: 'PENDING' | 'APPROVED' | 'DENIED';
  gameUserId?: string;
}

export function useInvitations(filters?: InvitationFilters) {
  const {
    data = {} as AxiosResponse,
    isPending,
    error = {} as AxiosError,
    status,
  } = useQuery({
    queryKey: [QueryKeys.INVITATIONS, filters],
    queryFn: async () => {
      // Only include defined and non-null parameters
      const queryParams = Object.entries(filters || {})
        .filter(([_, value]) => value !== undefined && value !== null)
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

      return axios
        .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/invitation`, { params: queryParams })
        .then((response: AxiosResponse) => response.data);
    },
  });

  return {
    data,
    isPending,
    error,
    status,
  };
}
