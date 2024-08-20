"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { HeaderLink } from "./HeaderLink";

export const AccountHeader = () => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ redirect: false });
      router.push("/");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="text-white h-16 flex items-center">
      <nav className="container mx-auto px-4 flex items-center justify-between whitespace-nowrap">
        <div className="flex space-x-4">
          <HeaderLink href="/account" exact>
            Overview
          </HeaderLink>
          <HeaderLink href="/account/profile">My Profile</HeaderLink>
          <HeaderLink href="/account/subscription">Subscription</HeaderLink>
          <HeaderLink href="/account/settings">Settings</HeaderLink>
        </div>
        <div className="flex space-x-4 items-center">
          <Link href="/dashboard">
            <button
              type="button"
              className="w-full bg-white text-black py-2 px-4 rounded"
            >
              Dashboard
            </button>
          </Link>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={
              "bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors duration-200 ease-in-out"
            }
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
};
