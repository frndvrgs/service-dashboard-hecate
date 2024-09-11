"use client";

import { HeaderLink } from "./HeaderLink";
import { SessionNavigation } from "./SessionNavigation";

export const DashboardHeader = () => {
  return (
    <header className="text-white h-16 flex items-center">
      <nav className="container mx-auto px-4 flex items-center justify-between whitespace-nowrap">
        <div className="flex space-x-4">
          {/* <HeaderLink href="/dashboard" exact>
            Overview
          </HeaderLink> */}
          <HeaderLink href="/dashboard" exact>
            My Works
          </HeaderLink>
        </div>
        <SessionNavigation />
      </nav>
    </header>
  );
};
