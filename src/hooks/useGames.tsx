import { useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axios, { AxiosError, AxiosResponse } from "axios";
import { QueryKeys } from "@/consts/types";
import { useToast } from "@/components/ui/use-toast";

export default function useGames() {
  const queryClient = useQueryClient();
  const { toast } = useToast();


  const [params, setParams] = useState({});

  const {
    data = {} as AxiosResponse,
    isPending,
    error = {} as AxiosError,
    status,
    refetch
  } = useQuery({
    queryKey: [QueryKeys.GAMES, params],
    queryFn: async () =>
      await axios.get<AxiosResponse>(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/game`,
        { params }
      ),
  });

  const createGame = useMutation({
    mutationFn: async (body) =>
      await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/game`, body),
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
    refetch,
    setParams,
    createGame,
  };
}
