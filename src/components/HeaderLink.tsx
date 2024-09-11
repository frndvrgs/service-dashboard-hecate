import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderLinkProps {
  href: string;
  children: React.ReactNode;
  exact?: boolean;
}

export const HeaderLink = ({
  href,
  children,
  exact = false,
}: HeaderLinkProps) => {
  const pathname = usePathname();

  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`transition-colors duration-200 ease-in-out
      ${isActive ? "text-white" : "text-[#646464] hover:text-white"}`}
    >
      {children}
    </Link>
  );
};
