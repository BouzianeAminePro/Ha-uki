"use client";

import { ReactNode } from "react";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function Provider({
  session,
  children,
}: {
  session: Session | null | undefined;
  children: ReactNode;
}) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider
        client={
          new QueryClient({
            queryCache: new QueryCache(),
            mutationCache: new MutationCache(),
            defaultOptions: {
              mutations: {
                // which converts to 5 minutes
                gcTime: 300000,
              },
            },
          })
        }
      >
        <NextThemesProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <DndProvider backend={HTML5Backend}>{children}</DndProvider>
        </NextThemesProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}