"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

import { HeaderLink } from "./HeaderLink";

export const HomeHeader = () => {
  const { data: session } = useSession();

  return (
    <header className="text-white h-16 flex items-center">
      <nav className="container mx-auto px-4 flex items-center justify-between whitespace-nowrap">
        <div className="flex space-x-4">
          <HeaderLink href="/" exact>
            Home
          </HeaderLink>
          <HeaderLink href="/features">Features</HeaderLink>
          <HeaderLink href="/pricing">Pricing</HeaderLink>
        </div>
        <div className="flex space-x-4 items-center">
          {!session ? (
            <>
              <HeaderLink href="/login">Log In</HeaderLink>

              <Link href="/signup">
                <button
                  type="button"
                  className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2 px-4 rounded transition-colors duration-200 ease-in-out"
                >
                  Sign Up
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/account">
                <button
                  type="button"
                  className="bg-transparent border border-gray-800 text-white hover:text-gray-300 py-2 px-4 rounded-md"
                >
                  My Account
                </button>
              </Link>
              <Link href="/dashboard">
                <button
                  type="button"
                  className="bg-white border border-transparent hover:bg-slate-200 text-black py-2 px-4 rounded-md"
                >
                  Dashboard
                </button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};
