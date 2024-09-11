"use client";

import { Breadcrumb } from "@/components/Breadcrumb";
import Link from "next/link";
import { FC, ReactNode } from "react";
import {
  UserCircleIcon,
  CreditCardIcon,
  DocumentTextIcon,
  NewspaperIcon,
} from "@heroicons/react/24/outline";

// Interface para as propriedades do AdminMenuItem
interface AdminMenuItemProps {
  href: string;
  children: ReactNode;
}

const AdminMenuItem: FC<AdminMenuItemProps> = ({ href, children }) => (
  <Link href={href} className="block">
    <div className="bg-[#1a1a1a] border border-[#2d2d2d] rounded-lg hover:bg-[#252525] transition-colors duration-200 aspect-square flex flex-col items-center justify-center p-4">
      {children}
    </div>
  </Link>
);

const Admin: FC = () => {
  const menuItems: AdminMenuItemProps[] = [
    {
      href: "/admin/accounts",
      children: (
        <>
          <UserCircleIcon className="w-12 h-12 mb-2 text-white" />
          <h3 className="text-xl font-semibold text-white text-center">
            Accounts
          </h3>
        </>
      ),
    },
    {
      href: "/admin/subscriptions",
      children: (
        <>
          <CreditCardIcon className="w-12 h-12 mb-2 text-white" />
          <h3 className="text-xl font-semibold text-white text-center">
            Subscriptions
          </h3>
        </>
      ),
    },
    {
      href: "/admin/works",
      children: (
        <>
          <DocumentTextIcon className="w-12 h-12 mb-2 text-white" />
          <h3 className="text-xl font-semibold text-white text-center">
            Works
          </h3>
        </>
      ),
    },
    {
      href: "/admin/content",
      children: (
        <>
          <NewspaperIcon className="w-12 h-12 mb-2 text-white" />
          <h3 className="text-xl font-semibold text-white text-center">
            Content
          </h3>
        </>
      ),
    },
  ];

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="w-full max-w-xl mx-auto p-8 bg-[#0a0a0a] border border-[#2d2d2d] rounded-lg shadow-lg space-y-6">
        <Breadcrumb items={[{ label: "Admin" }]} />
        <div className="grid grid-cols-2 gap-4 aspect-square">
          {menuItems.map((item) => (
            <AdminMenuItem key={item.href} href={item.href}>
              {item.children}
            </AdminMenuItem>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Admin;
