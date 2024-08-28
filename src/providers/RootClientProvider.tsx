"use client";

import { SessionProvider } from "next-auth/react";
import { ReactQueryProvider } from "@/providers/ReactQuery";

export const RootClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ReactQueryProvider>
      <SessionProvider>{children}</SessionProvider>
    </ReactQueryProvider>
  );
};
