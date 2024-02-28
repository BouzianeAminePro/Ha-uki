import { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
// import { PrismaAdapter } from "@auth/prisma-adapter"
// import { PrismaClientInstance } from "@/lib";

export const authOptions = {
  providers: [
    Google({
      clientId: String(process.env.GOOGLE_CLIENT_ID),
      clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
    }),
  ],
  // adapter: PrismaAdapter(PrismaClientInstance.getInstance()),
  // debug: true,
} as NextAuthOptions;
