import type { Metadata } from "next";
import {ReactNode} from "react";
import "./globals.css";
import {geistMono, geistSans} from "@/app/components/ui/fonts";
import Providers from "@/app/providers";


export const metadata: Metadata = {
  title: {
      template: '%s | Crypto charity',
      default: "Crypto Charity",
  },
  icons: {
   icon: '/crypto-charity-white.svg',
  },
  description: "Crypto charity platform",
};

export default function RootLayout({children}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
