import type { Metadata } from "next";

import "./globals.css";
import { IdentityProvider } from "@/lib/identity";
import Header from "@/components/Header";



export const metadata: Metadata = {
  title: "Waypoint — survive the semester",
  description:
    "Ask a senior who's already taken the course. Find the notes and past papers that actually help.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <IdentityProvider>
          <Header />
          <main className="flex-1">{children}</main>
        </IdentityProvider>
      </body>
    </html>
  );
}
