"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { HeaderLink } from "./HeaderLink";

export const DashboardHeader = () => {
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
          <HeaderLink href="/dashboard" exact>
            Overview
          </HeaderLink>
          <HeaderLink href="/dashboard/works">My Works</HeaderLink>
          <HeaderLink href="/dashboard/create-work">Create Work</HeaderLink>
        </div>
        <div className="flex space-x-4 items-center">
          <Link href="/account">
            <button
              type="button"
              className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2 px-4 rounded transition-colors duration-200 ease-in-out"
            >
              My Account
            </button>
          </Link>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={
              "w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors duration-200 ease-in-out"
            }
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
};
