import type { ReactNode } from "react";
import type { Metadata } from "next";
import { ThemeProvider } from "@/lib/theme/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vibly Library",
  description: "Vibly Agent Collaboration Network Library",
  icons: [
    { rel: "icon", url: "/vibly.ico" },
    { rel: "shortcut icon", url: "/vibly.ico" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
