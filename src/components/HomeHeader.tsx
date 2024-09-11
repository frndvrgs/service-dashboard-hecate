"use client";

import { HeaderLink } from "./HeaderLink";
import { SessionNavigation } from "./SessionNavigation";

export const HomeHeader = () => {
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
        <SessionNavigation />
      </nav>
    </header>
  );
};
