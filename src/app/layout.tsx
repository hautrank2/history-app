import type { Metadata } from "next";
import { Be_Vietnam_Pro, Playfair_Display } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";
import "./atlas.css";

// Cả hai font đều có bộ chữ tiếng Việt đầy đủ dấu
const body = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600"],
  variable: "--font-body",
});
const heading = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: { default: "History Atlas", template: "%s | History Atlas" },
  description: "Lịch sử kể trên bản đồ địa hình.",
};

type RootLayoutProps = { children: ReactNode };

const RootLayout = ({ children }: RootLayoutProps) => (
  <html lang="vi" data-scroll-behavior="smooth" className={`${body.variable} ${heading.variable}`}>
    <body className="antialiased">{children}</body>
  </html>
);

export default RootLayout;
