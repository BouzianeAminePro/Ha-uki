import { NextAuthOptions, User } from "next-auth";
import Google from "next-auth/providers/google";
import { userService } from "@/services";

export const authOptions = {
  providers: [
    Google({
      clientId: String(process.env.GOOGLE_CLIENT_ID),
      clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
    }),
  ],
  callbacks: {
    // async session({ session }) {
    //   const dbUser = await userService.findUserByEmail(session?.user?.email);
    //   return {
    //     ...session,
    //     user: {
    //       ...dbUser,
    //     },
    //   };
    // },
    async jwt({ token }) {
      const dbUser = await userService.findUserByEmail(token?.email);
      return { ...token, user: dbUser };
    },
    async signIn({ user }: { user: User }) {
      if (!user) {
        return false;
      }

      const localUser = await userService.findUserByEmail(user?.email);
      if (!localUser) {
        await userService.create(user as User);
      }

      return true;
    },
  },
} as NextAuthOptions;
