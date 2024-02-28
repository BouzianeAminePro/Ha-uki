import type { Metadata } from "next";
import { Dosis } from "next/font/google";

import { Session } from "next-auth";
import NextTopLoader from "nextjs-toploader";

import "./globals.css";
import { cn } from "@/lib/utils";
import Provider from "@/components/Provider/Provider";
import MenuBar from "@/components/MenuBar/MenuBar";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Sportify",
  description: "Pour le publique sportif",
};

const dosis = Dosis({
  weight: "400",
  subsets: ["latin"],
});

export default function RootLayout({
  session,
  children,
}: Readonly<{
  session: Session | null | undefined;
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={cn(dosis.className)} suppressHydrationWarning={true}>
        <NextTopLoader
          initialPosition={0.08}
          height={3}
          color="#4b5563"
          crawl={true}
          showSpinner={false}
        />
        <Provider session={session}>
          <MenuBar />
          {children}
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
