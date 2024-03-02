import { useState } from "react";

import { QueryKeys } from "@/consts";
import { useQuery } from "@tanstack/react-query";

import axios, { AxiosError, AxiosResponse } from "axios";

export default function useGames() {
  const [params, setParams] = useState({});

  const {
    data = {} as AxiosResponse,
    isPending,
    error = {} as AxiosError,
    status,
  } = useQuery({
    queryKey: [QueryKeys.GAMES, params],
    queryFn: async () => {
      return await axios.get<AxiosResponse>(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/game`,
        { params }
      );
    },
  });

  return {
    data,
    isPending,
    error,
    status,
    setParams,
  };
}
