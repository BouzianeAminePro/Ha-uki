import axios from "axios";
import { User } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";

export default function useUser(id?: string) {
  const updateUser = useMutation({
    mutationFn: async ({ body }: { body: Partial<User> }) =>
      await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/${id}`,
        body
      ),
  });
  return { updateUser };
}
