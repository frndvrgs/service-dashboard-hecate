import { AdminHeader } from "@/components/AdminHeader";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AdminHeader />
      <main className="border-t border-gray-800 pb-16 pt-16">{children}</main>
    </>
  );
};

export default AdminLayout;
