import type { Metadata } from "next";
import { Dosis } from "next/font/google";

import { Session } from "next-auth";

import "./globals.css";
import { cn } from "@/lib/utils";
import Provider from "@/components/Provider/Provider";
import MenuBar from "@/components/MenuBar/MenuBar";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/Footer/Footer";

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
        <Provider session={session}>
          <MenuBar />
          <div
            className={cn("h-screen w-full flex items-center justify-center")}
          >
            {children}
          </div>
          <Toaster />
        </Provider>
        <Footer />
      </body>
    </html>
  );
}
