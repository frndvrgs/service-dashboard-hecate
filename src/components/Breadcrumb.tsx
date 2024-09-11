import { HeaderLink } from "./HeaderLink";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav className="flex text-sm pb-3 border-b border-[#2d2d2d]">
      <ol className="inline-flex items-center">
        {items.map((item, index) => (
          <li key={index}>
            <div className="flex items-center">
              {index > 0 && <span className="text-[#4e4e4e] mx-2">/</span>}
              {item.href ? (
                <HeaderLink href={item.href} exact>
                  {item.label}
                </HeaderLink>
              ) : (
                <span className="text-white">{item.label}</span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};
