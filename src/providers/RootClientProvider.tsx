"use client";

import { SessionProvider } from "next-auth/react";

export const RootClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <SessionProvider>{children}</SessionProvider>;
};
