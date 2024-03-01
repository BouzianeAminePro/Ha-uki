import { QueryKeys } from "@/consts";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";

export default function useGames() {
  const {
    data = {} as AxiosResponse,
    isPending,
    error = {} as AxiosError,
    status,
  } = useQuery({
    queryKey: [QueryKeys.GAMES],
    queryFn: async () =>
      await axios.get<AxiosResponse>(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/game`
      ),
  });

  return {
    data,
    isPending,
    error,
    status,
  };
}
