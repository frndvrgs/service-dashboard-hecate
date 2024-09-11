"use client";

import { useGraphQLQuery } from "@/hooks/useGraphQL";
import { READ_ACCOUNT } from "@/interface/v1/schemas/account";
import { Breadcrumb } from "@/components/Breadcrumb";
import { AdminAccountDetails } from "./AdminAccountDetails";
import { AdminAccountUpdateForm } from "./AdminAccountUpdateForm";

interface AdminAccountProps {
  params: { id_account: string };
}

const AdminAccount = ({ params }: AdminAccountProps) => {
  // external hooks
  const readAccountQuery = useGraphQLQuery<
    "readAccount",
    API.GraphQL.v1.readAccountQueryArgs
  >(`readAccount`, [`account_${params.id_account}`], READ_ACCOUNT, {
    options: {
      where: [
        { field: "id_account", operator: "EQ", value: params.id_account },
      ],
    },
  });

  // rendering

  return (
    <section className="container mx-auto px-4 flex justify-center items-center">
      <div className="w-full max-w-4xl p-8 bg-[#0a0a0a] border border-[#2d2d2d] rounded-lg shadow-lg space-y-6">
        <Breadcrumb
          items={[
            { label: "Accounts", href: "/admin/accounts" },
            { label: params.id_account },
          ]}
        />

        {readAccountQuery.isLoading ? (
          <div className="text-[#6e6e6e] uppercase text-center text-sm">
            loading
          </div>
        ) : readAccountQuery.error ? (
          <div className="text-red-500 uppercase text-center text-sm">
            error
          </div>
        ) : !readAccountQuery.data?.output ? (
          <div className="text-red-500 uppercase text-center text-sm">
            not found
          </div>
        ) : (
          <>
            <AdminAccountDetails account={readAccountQuery.data.output} />
            <AdminAccountUpdateForm account={readAccountQuery.data.output} />
          </>
        )}
      </div>
    </section>
  );
};

export default AdminAccount;
