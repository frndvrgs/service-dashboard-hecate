"use client";

import { useGraphQLQuery } from "@/hooks/useGraphQL";
import { READ_ACCOUNT } from "@/interface/v1/schemas/account";
import { Breadcrumb } from "@/components/Breadcrumb";
import { AccountDetails } from "./AccountDetails";
import { AccountUpdateForm } from "./AccountUpdateForm";

const Account = () => {
  // external hooks
  const readAccountQuery = useGraphQLQuery<
    "readAccount",
    API.GraphQL.v1.readAccountQueryArgs
  >("readAccount", [`user_account`], READ_ACCOUNT);

  // rendering

  return (
    <section className="container mx-auto px-4 flex justify-center items-center">
      <div className="w-full max-w-4xl p-8 bg-[#0a0a0a] border border-[#2d2d2d] rounded-lg shadow-lg space-y-6">
        <Breadcrumb items={[{ label: "My Account" }]} />

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
            <AccountDetails account={readAccountQuery.data.output} />
            <AccountUpdateForm account={readAccountQuery.data.output} />
          </>
        )}
      </div>
    </section>
  );
};

export default Account;
