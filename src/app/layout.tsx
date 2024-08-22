import { Inter } from "next/font/google";
import "./global.css";
import type { Metadata } from "next";
import { RootClientProvider } from "@/providers/RootClientProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "next: hecate",
  description: "service-dashboard-hecate",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RootClientProvider>{children}</RootClientProvider>
      </body>
    </html>
  );
}
