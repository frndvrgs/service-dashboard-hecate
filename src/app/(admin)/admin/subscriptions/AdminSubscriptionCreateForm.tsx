"use client";

import { useForm, Controller } from "react-hook-form";
import { createSubscription } from "@/actions/account";
import { useQueryClient } from "@tanstack/react-query";
import { useGraphQLQuery } from "@/hooks/useGraphQL";
import { useServerAction } from "@/hooks/useServerAction";
import { useOperationStatus } from "@/hooks/useOperationStatus";
import { LIST_ACCOUNTS } from "@/interface/v1/schemas/account";
import { FieldInput } from "@/components/FieldInput";
import { FieldSelect } from "@/components/FieldSelect";
import { ActionButton } from "@/components/ActionButton";

type FormData = API.GraphQL.v1.CreateSubscriptionInput & { id_account: string };

export const AdminSubscriptionCreateForm = () => {
  // external hooks
  const queryClient = useQueryClient();
  const { operationStatus, updateOperationStatus } = useOperationStatus();
  const createAction = useServerAction(createSubscription);

  const listAccountsQuery = useGraphQLQuery<
    "listAccounts",
    API.GraphQL.v1.listAccountsQueryArgs
  >("listAccounts", ["accounts"], LIST_ACCOUNTS, {
    options: { order: [{ field: "created_at", direction: "DESC" }] },
  });

  const { control, handleSubmit, reset, trigger, setFocus } = useForm<FormData>(
    {
      defaultValues: { id_account: "", type: "", status: "" },
    },
  );

  // handlers

  const handleCreateSubscription = async (formData: FormData) => {
    const operationName = "createSubscription";

    updateOperationStatus(operationName, "loading");

    const { id_account, ...subscriptionInput } = formData;

    const { data, error } = await createAction.execute({
      account: id_account,
      input: {
        ...subscriptionInput,
      },
    });

    if (error) {
      console.error("create subscription error", error);
      updateOperationStatus(operationName, "error", error);
      return;
    }

    if (data?.status.isError) {
      console.error("create subscription error", data.status);
      updateOperationStatus(operationName, "error", data.status);
      return;
    }

    if (data) {
      console.log("create subscription:", data);
      updateOperationStatus(operationName, "success");
      await queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      setFocus("id_account");
      reset();
    }
  };

  // rendering

  return (
    <form
      onSubmit={handleSubmit(handleCreateSubscription)}
      className="space-y-6"
    >
      <Controller
        name="id_account"
        control={control}
        rules={{
          required: "This field is required.",
        }}
        render={({ field, fieldState }) => (
          <FieldSelect
            field={field}
            fieldState={fieldState}
            name="id_account"
            label="account"
            options={
              listAccountsQuery.data?.output
                ? listAccountsQuery.data.output.map((account) => ({
                    value: account.id_account,
                    label: account.id_account,
                    description: account.email[0],
                  }))
                : []
            }
            placeholder="select an account"
            status={
              listAccountsQuery.isLoading
                ? "loading"
                : listAccountsQuery.error ||
                    listAccountsQuery.data?.status.isError
                  ? "error"
                  : undefined
            }
          />
        )}
      />

      <Controller
        name="type"
        control={control}
        rules={{
          required: "This field is required.",
        }}
        render={({ field, fieldState }) => (
          <FieldInput
            field={field}
            fieldState={fieldState}
            name="type"
            label="type"
            onChange={() => {
              if (fieldState.isDirty) {
                trigger("type");
              }
            }}
          />
        )}
      />

      <Controller
        name="status"
        control={control}
        rules={{ required: "This field is required." }}
        render={({ field, fieldState }) => (
          <FieldInput
            field={field}
            fieldState={fieldState}
            name="status"
            label="status"
            onChange={() => {
              if (fieldState.isDirty) {
                trigger("status");
              }
            }}
          />
        )}
      />
      <ActionButton
        status={operationStatus["createSubscription"]?.status}
        label="Create Subscription"
        className="bg-white text-black"
      />
    </form>
  );
};
