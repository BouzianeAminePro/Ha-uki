import type { Metadata } from "next";
import { Dosis } from "next/font/google";

import "./globals.css";
import { cn } from "../lib";

import Provider from "../components/Provider/Provider";
import MenuBar from "../components/MenuBar/MenuBar";
import Footer from "../components/Footer/Footer";

export const metadata: Metadata = {
  title: "Play-me",
  description: "Pour le publique sportif",
};

const dosis = Dosis({
  weight: '400',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={cn(dosis.className)} suppressHydrationWarning={true}>
        <Provider>
          <MenuBar />
          <div
            className={cn("h-[84.3vh] w-full flex items-center justify-center")}
          >
            {children}
          </div>
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
