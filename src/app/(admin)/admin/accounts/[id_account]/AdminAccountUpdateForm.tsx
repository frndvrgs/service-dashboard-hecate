import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useOperationStatus } from "@/hooks/useOperationStatus";
import { useServerAction } from "@/hooks/useServerAction";
import { updateAccount } from "@/actions/account";
import { FieldInput } from "@/components/FieldInput";
import { isEqual } from "lodash-es";

interface AdminAccountUpdateForm {
  account: API.GraphQL.v1.Account;
}

type FormData = API.GraphQL.v1.UpdateAccountInput;

export const AdminAccountUpdateForm = ({ account }: AdminAccountUpdateForm) => {
  // external hooks
  const queryClient = useQueryClient();
  const { operationStatus, updateOperationStatus } = useOperationStatus();

  const updateAction = useServerAction(updateAccount);

  const accountForm = useForm<FormData>({
    defaultValues: {
      github_token: "",
      scope: "",
    },
    mode: "onBlur",
  });

  // effects

  useEffect(() => {
    if (account) {
      const { scope } = account;
      accountForm.setValue("scope", scope);
    }
  }, [account, accountForm.setValue]);

  // handlers

  const handleUpdateAccount = async (fieldName: keyof FormData) => {
    if (!(await accountForm.trigger(fieldName))) return;

    const newValue = accountForm.getValues(fieldName);
    const currentValue = fieldName === "github_token" ? "" : account[fieldName];

    if (isEqual(newValue, currentValue)) return;

    const operationName = `update_${fieldName}`;

    updateOperationStatus(operationName, "loading");

    const { data, error } = await updateAction.execute({
      account: account.id_account,
      input: { [fieldName]: newValue },
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
        queryKey: ["accounts", `account_${account.id_account}`],
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
            label="github_token"
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
      <Controller
        name="scope"
        control={accountForm.control}
        render={({ field, fieldState }) => (
          <FieldInput
            field={field}
            fieldState={fieldState}
            name="scope"
            label="scope"
            status={operationStatus["update_scope"]?.status}
            onBlur={() => {
              if (fieldState.isDirty) {
                handleUpdateAccount("scope");
              }
            }}
          />
        )}
      />
    </form>
  );
};
