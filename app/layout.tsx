import type React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import ChatWidget from "@/components/chat-widget";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Maple Air - Premium Air Conditioning Solutions",
  description:
    "Find the perfect air conditioning solution for your home or business with Maple Air.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
