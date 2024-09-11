import { AccountHeader } from "@/components/AccountHeader";

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AccountHeader />
      <main className="border-t border-[#2d2d2d] pb-16 pt-16">{children}</main>
    </>
  );
};

export default AccountLayout;
