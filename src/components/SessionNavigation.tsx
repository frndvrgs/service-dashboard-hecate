import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  UserCircleIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { HeaderLink } from "./HeaderLink";

export const SessionNavigation = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ redirect: true, callbackUrl: "/" });
    } catch (error) {
      console.error("logout failed", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const isHome = pathname === "/";

  return (
    <div className="flex space-x-4 items-center">
      {!isHome && (
        <HeaderLink href="/" exact>
          Back to Home
        </HeaderLink>
      )}
      {!session ? (
        <>
          <HeaderLink href="/login">Log In</HeaderLink>
          <Link href="/signup">
            <button
              type="button"
              className="w-full bg-[#1b1b1b] hover:bg-[#222222] text-white py-2 px-4 rounded transition-colors duration-200 ease-in-out"
            >
              Sign Up
            </button>
          </Link>
        </>
      ) : (
        <>
          <Link
            href="/dashboard"
            className="w-full bg-white text-black py-2 px-4 rounded"
          >
            Dashboard
          </Link>

          <Link
            href="/account"
            className="w-full bg-[#1b1b1b] hover:bg-[#222222] text-white py-2 px-2 rounded transition-colors duration-200 ease-in-out"
          >
            <UserCircleIcon className="w-6 h-6" />
          </Link>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full bg-red-600 hover:bg-red-500 text-white py-2 px-2 rounded transition-colors duration-200 ease-in-out"
          >
            <ArrowRightStartOnRectangleIcon className="w-6 h-6" />
          </button>
        </>
      )}
    </div>
  );
};
