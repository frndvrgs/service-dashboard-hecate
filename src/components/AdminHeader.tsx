"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HeaderLink } from "./HeaderLink";

export const AdminHeader = () => {
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
          <HeaderLink href="/admin" exact>
            Overview
          </HeaderLink>
          <HeaderLink href="/admin/accounts">Accounts</HeaderLink>
          <HeaderLink href="/admin/subscriptions">Subscriptions</HeaderLink>
          <HeaderLink href="/admin">Works</HeaderLink>
          <HeaderLink href="/admin">Profiles</HeaderLink>
          <HeaderLink href="/admin">Features</HeaderLink>
        </div>
        <div className="flex space-x-4 items-center">
          <HeaderLink href="/" exact>Back to Home</HeaderLink>
          <Link href="/account">
            <button
              type="button"
              className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2 px-4 rounded transition-colors duration-200 ease-in-out"
            >
              My Account
            </button>
          </Link>
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
