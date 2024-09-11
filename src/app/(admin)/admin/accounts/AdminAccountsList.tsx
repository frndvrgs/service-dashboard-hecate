"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useGraphQLQuery } from "@/hooks/useGraphQL";
import { useServerAction } from "@/hooks/useServerAction";
import { useOperationStatus } from "@/hooks/useOperationStatus";
import { removeAccount } from "@/actions/account";
import { LIST_ACCOUNTS } from "@/interface/v1/schemas/account";
import { InfoContainer } from "@/components/InfoContainer";
import { InfoItem } from "@/components/InfoItem";
import { InfoList } from "@/components/InfoList";

export const AdminAccountList = () => {
  // external hooks

  const queryClient = useQueryClient();
  const { operationStatus, updateOperationStatus } = useOperationStatus();
  const removeAction = useServerAction(removeAccount);

  const listAccountsQuery = useGraphQLQuery<
    "listAccounts",
    API.GraphQL.v1.listAccountsQueryArgs
  >("listAccounts", ["accounts"], LIST_ACCOUNTS, {
    options: { order: [{ field: "created_at", direction: "DESC" }] },
  });

  // handlers

  const handleRemoveAccount = async (id_account: string) => {
    const operationName = `removeAccount_${id_account}`;
    updateOperationStatus(operationName, "loading");

    const { data, error } = await removeAction.execute({ account: id_account });

    if (error) {
      console.error("update account error", error);
      updateOperationStatus(operationName, "error", error);
      return;
    }

    if (data?.status.isError) {
      console.error("update account error", data.status);
      updateOperationStatus(operationName, "error", data.status);
      return;
    }

    if (data) {
      console.log("update account:", data);
      updateOperationStatus(operationName, "success");
      await queryClient.invalidateQueries({
        queryKey: ["accounts", "subscriptions"],
      });
    }
  };

  // fallbacks

  if (listAccountsQuery.isLoading)
    return (
      <div className="text-[#6e6e6e] uppercase text-center text-sm">
        loading
      </div>
    );
  if (listAccountsQuery.error)
    return (
      <div className="text-red-500 uppercase text-center text-sm">error</div>
    );
  if (!listAccountsQuery.data?.output)
    return (
      <div className="text-red-500 uppercase text-center text-sm">
        not found
      </div>
    );

  // rendering

  const data_accounts = listAccountsQuery.data.output;

  return (
    <div className="space-y-6">
      {data_accounts.map((account) => (
        <InfoContainer
          key={account.id_account}
          showControls
          layout="grid"
          linkHref={`/admin/accounts/${account.id_account}`}
          linkTitle="Edit Account"
          removeFn={() => handleRemoveAccount(account.id_account)}
          removeStatus={
            operationStatus[`removeAccount_${account.id_account}`]?.status
          }
          removeTitle="Remove Account"
        >
          <InfoItem label="id_account" value={account.id_account} />
          <InfoList label="email" list={account.email} />
          <InfoItem
            label="created_at"
            value={
              account.created_at
                ? new Date(account.created_at).toLocaleDateString()
                : ""
            }
          />
          <InfoItem
            label="updated_at"
            value={
              account.updated_at
                ? new Date(account.updated_at).toLocaleDateString()
                : ""
            }
          />
          <InfoItem label="scope" value={account.scope} />
          <InfoItem
            label="has_github_token"
            value={account.has_github_token?.toString()}
          />
        </InfoContainer>
      ))}
    </div>
  );
};
