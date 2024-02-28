import NextAuth from "next-auth";
import { authOptions } from "@/consts";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
