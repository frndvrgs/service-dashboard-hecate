"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useServerAction } from "@/hooks/useServerAction";
import { useOperationStatus } from "@/hooks/useOperationStatus";
import { removeAccount } from "@/actions/account";
import { InfoContainer } from "@/components/InfoContainer";
import { InfoItem } from "@/components/InfoItem";
import { InfoList } from "@/components/InfoList";

interface AdminAccountDetailsProps {
  account: API.GraphQL.v1.Account;
}

export const AdminAccountDetails = ({ account }: AdminAccountDetailsProps) => {
  // external hooks

  const router = useRouter();
  const queryClient = useQueryClient();
  const { operationStatus, updateOperationStatus } = useOperationStatus();
  const removeAction = useServerAction(removeAccount);

  // handlers

  const handleRemoveAccount = async () => {
    const operationName = "removeAccount";
    updateOperationStatus(operationName, "loading");

    const { data, error } = await removeAction.execute({
      account: account.id_account,
    });

    if (error) {
      console.error("remove account error", error);
      updateOperationStatus(operationName, "error", error);
      return;
    }

    if (data?.status.isError) {
      console.error("remove account error", data.status);
      updateOperationStatus(operationName, "error", data.status);
      return;
    }

    if (data) {
      console.log("remove account:", data);
      await queryClient.invalidateQueries({
        queryKey: ["accounts", "subscriptions"],
      });
      router.push("/admin/accounts");
    }
  };

  // rendering

  return (
    <InfoContainer
      showControls
      removeFn={() => handleRemoveAccount()}
      removeStatus={operationStatus["removeAccount"]?.status}
      removeTitle="Remove Account"
    >
      <InfoItem label="id_account" value={account.id_account} />
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
      <InfoList label="email" list={account.email} />
      <InfoItem label="scope" value={account.scope} />
      <InfoItem
        label="has_github_token"
        value={account.has_github_token.toString()}
      />
      {account.document?.repositories && (
        <InfoList
          label="repositories"
          list={account.document?.repositories?.map(
            (repository: Record<string, any>) => repository.name,
          )}
        />
      )}
    </InfoContainer>
  );
};
