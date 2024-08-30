"use client";

import { ReactNode } from "react";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { AxiosError } from "axios";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { useToast } from "../ui/use-toast";

export default function Provider({
  session,
  children,
}: {
  session: Session | null | undefined;
  children: ReactNode;
}) {
  const { toast } = useToast();
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
                onError(error: any) {
                  let title = "";
                  switch (error.status) {
                    case 401:
                    case 403:
                      title = "Unauthorized for this resource";
                      break;
                    case 404:
                      title = "Not found";
                      break;
                    default:
                      title = "Opps! error on server call"
                  }
                  toast({
                    variant: "destructive",
                    title
                  });
                },
              },
            },
          })
        }
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <DndProvider backend={HTML5Backend}>{children}</DndProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
