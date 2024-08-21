import { DashboardHeader } from "@/components/DashboardHeader";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <DashboardHeader />
      <main className="border-t border-gray-800 pb-16 pt-16">{children}</main>
    </>
  );
};

export default DashboardLayout;
