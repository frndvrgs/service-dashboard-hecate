"use client";

import { HeaderLink } from "./HeaderLink";
import { SessionNavigation } from "./SessionNavigation";

export const AdminHeader = () => {
  return (
    <header className="text-white h-16 flex items-center">
      <nav className="container mx-auto px-4 flex items-center justify-between whitespace-nowrap">
        <div className="flex space-x-4">
          <HeaderLink href="/admin" exact>
            Overview
          </HeaderLink>
          <HeaderLink href="/admin/accounts">Accounts</HeaderLink>
          <HeaderLink href="/admin/subscriptions">Subscriptions</HeaderLink>
          <HeaderLink href="/admin/works">Works</HeaderLink>
          <HeaderLink href="/admin/content">Content</HeaderLink>
        </div>
        <SessionNavigation />
      </nav>
    </header>
  );
};
