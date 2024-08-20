"use client";

// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
// import { useSession } from "next-auth/react"
import { AccountHeader } from "@/components/AccountHeader";

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  // const { data: session, status } = useSession()
  // const router = useRouter();

  // useEffect(() => {
  //   if (status !== 'loading' && !session) {
  //     router.push("/");
  //   }
  // }, [session, status ]);

  // if (status === 'loading') {
  //   return <div>Loading...</div>;
  // }

  // if (!session) {
  //   return null;
  // }

  return (
    <>
      <AccountHeader />
      <main className="border-t border-gray-800 pb-16 pt-16">{children}</main>
    </>
  );
};

export default AccountLayout;
