import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useOperationStatus } from "@/hooks/useOperationStatus";
import { useServerAction } from "@/hooks/useServerAction";
import { updateAccount } from "@/actions/account";
import { FieldInput } from "@/components/FieldInput";

interface AdminAccountUpdateForm {
  account: API.GraphQL.v1.Account;
}

type FormData = API.GraphQL.v1.UpdateAccountInput;

export const AccountUpdateForm = ({ account }: AdminAccountUpdateForm) => {
  // external hooks
  const queryClient = useQueryClient();
  const { operationStatus, updateOperationStatus } = useOperationStatus();

  const updateAction = useServerAction(updateAccount);

  const accountForm = useForm<FormData>({
    defaultValues: {
      github_token: "",
    },
    mode: "onBlur",
  });

  // handlers

  const handleUpdateAccount = async (fieldName: keyof FormData) => {
    if (!(await accountForm.trigger(fieldName))) return;

    const value = accountForm.getValues(fieldName);
    const operationName = `update_${fieldName}`;

    updateOperationStatus(operationName, "loading");

    const { data, error } = await updateAction.execute({
      account: account.id_account,
      input: { [fieldName]: value },
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
      if (fieldName === "github_token")
        accountForm.setValue("github_token", "");
      await queryClient.invalidateQueries({
        queryKey: [`account_${account.id_account}`],
      });
    }
  };

  // rendering

  return (
    <form className="space-y-6">
      <Controller
        name="github_token"
        control={accountForm.control}
        rules={{
          minLength: {
            value: 80,
            message: "This field should be at least 80 characters long.",
          },
        }}
        render={({ field, fieldState }) => (
          <FieldInput
            field={field}
            fieldState={fieldState}
            name="github_token"
            label="GitHub Personal Access Token"
            placeholder="github_pat_"
            status={operationStatus["update_github_token"]?.status}
            onBlur={() => {
              if (fieldState.isDirty) {
                handleUpdateAccount("github_token");
              }
            }}
          />
        )}
      />
    </form>
  );
};
