import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Playfair_Display } from "next/font/google";
import type { ReactNode } from "react";
import { GameAudio } from "~/components/game-audio";
import { ReadingThemeToggle } from "~/components/reading-theme-toggle";
import { RootLink } from "~/components/root-link";

import "~/styles/globals.css";
import "~/styles/atlas.css";
import "~/styles/game-theme.css";
import "~/styles/reading-theme.css";

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
  applicationName: "History Atlas",
  title: { default: "History Atlas", template: "%s | History Atlas" },
  description: "Lịch sử kể trên bản đồ địa hình.",
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon.svg", type: "image/svg+xml", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
    apple: { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f3ecdc",
  colorScheme: "light dark",
};

type RootLayoutProps = { children: ReactNode };

const RootLayout = ({ children }: RootLayoutProps) => (
  <html
    lang="vi"
    data-theme="arena"
    data-reading-mode="light"
    data-scroll-behavior="smooth"
    suppressHydrationWarning
    className={`${body.variable} ${heading.variable}`}
  >
    <head>
      <script
        dangerouslySetInnerHTML={{
          __html: `try{const mode=localStorage.getItem("history-atlas-reading-theme")==="dark"?"dark":"light";document.documentElement.dataset.readingMode=mode;document.querySelector('meta[name="theme-color"]')?.setAttribute("content",mode==="dark"?"#211e19":"#f3ecdc")}catch{}`,
        }}
      />
    </head>
    <body className="antialiased">
      {children}
      <RootLink />
      <ReadingThemeToggle />
      <GameAudio />
    </body>
  </html>
);

export default RootLayout;
