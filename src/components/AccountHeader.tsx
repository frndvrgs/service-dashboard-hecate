"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HeaderLink } from "./HeaderLink";
import { SessionNavigation } from "./SessionNavigation";

export const AccountHeader = () => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ redirect: false });
      router.push("/");
    } catch (error) {
      console.error("logout failed", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="text-white h-16 flex items-center">
      <nav className="container mx-auto px-4 flex items-center justify-between whitespace-nowrap">
        <div className="flex space-x-4">
          <HeaderLink href="/account" exact>
            My Account
          </HeaderLink>
          <HeaderLink href="/account/subscription">Subscription</HeaderLink>
        </div>
        <SessionNavigation />
      </nav>
    </header>
  );
};
