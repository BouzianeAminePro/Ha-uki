import { create, findUserByEmail } from "@/services/user.service";
import { NextAuthOptions, User } from "next-auth";
import Google from "next-auth/providers/google";

export const authOptions = {
  providers: [
    Google({
      clientId: String(process.env.GOOGLE_CLIENT_ID),
      clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
    }),
  ],
  callbacks: {
    async session({ session }) {
      const dbUser = await findUserByEmail(session?.user?.email);
      return {
        ...session,
        user: dbUser,
      };
    },
    async jwt({ token }) {
      const dbUser = await findUserByEmail(token?.email);
      return { ...token, user: dbUser };
    },
    async signIn({ user }: { user: User }) {
      if (!user) {
        return false;
      }

      const localUser = await findUserByEmail(user?.email);
      if (!localUser) {
        await create(user as User);
      }

      return true;
    },
  },
} as NextAuthOptions;
