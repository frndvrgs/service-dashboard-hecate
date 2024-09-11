"use client";

import { signOut } from "next-auth/react";
import { useServerAction } from "@/hooks/useServerAction";
import { useOperationStatus } from "@/hooks/useOperationStatus";
import { removeAccount } from "@/actions/account";
import { InfoContainer } from "@/components/InfoContainer";
import { InfoItem } from "@/components/InfoItem";
import { InfoList } from "@/components/InfoList";

interface AdminAccountDetailsProps {
  account: API.GraphQL.v1.Account;
}

export const AccountDetails = ({ account }: AdminAccountDetailsProps) => {
  // external hooks

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
      await signOut({ redirect: false, callbackUrl: "/" });
    }
  };

  // rendering

  return (
    <InfoContainer
      showControls
      removeFn={() => handleRemoveAccount()}
      removeStatus={operationStatus["removeAccount"]?.status}
      removeTitle="Remove My Account"
    >
      <InfoList label="Email" list={account.email} />
      <InfoItem
        label="GitHub Personal Access Token"
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
