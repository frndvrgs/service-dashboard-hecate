"use client";

import { useForm, Controller } from "react-hook-form";
import { createAccount } from "@/actions/account";
import { useQueryClient } from "@tanstack/react-query";
import { useServerAction } from "@/hooks/useServerAction";
import { useOperationStatus } from "@/hooks/useOperationStatus";
import { FieldInput } from "@/components/FieldInput";
import { ActionButton } from "@/components/ActionButton";

type FormData = API.GraphQL.v1.UpsertAccountInput;

export const AdminAccountCreateForm = () => {
  // external hooks
  const queryClient = useQueryClient();
  const { operationStatus, updateOperationStatus } = useOperationStatus();

  const createAction = useServerAction(createAccount);

  const { control, handleSubmit, reset, trigger, setFocus } = useForm<FormData>(
    {
      defaultValues: { email: "", scope: "" },
    },
  );

  // handlers

  const handleCreateAccount = async (formData: FormData) => {
    const operationName = "createAccount";

    updateOperationStatus(operationName, "loading");

    const { data, error } = await createAction.execute({
      input: {
        ...formData,
      },
    });

    if (error) {
      console.error("create account error", error);
      updateOperationStatus(operationName, "error", error);
      return;
    }

    if (data?.status.isError) {
      console.error("create account error", data.status);
      updateOperationStatus(operationName, "error", data.status);
      return;
    }

    if (data) {
      console.log("create account:", data);
      updateOperationStatus(operationName, "success");
      await queryClient.invalidateQueries({ queryKey: ["accounts"] });
      setFocus("email");
      reset();
    }
  };

  // rendering

  return (
    <form onSubmit={handleSubmit(handleCreateAccount)} className="space-y-6">
      <Controller
        name="email"
        control={control}
        rules={{
          required: "This field is required.",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid e-mail address.",
          },
        }}
        render={({ field, fieldState }) => (
          <FieldInput
            field={field}
            fieldState={fieldState}
            name="email"
            label="email"
            inputMode="email"
            onChange={() => {
              if (fieldState.isDirty) {
                trigger("email");
              }
            }}
          />
        )}
      />

      <Controller
        name="scope"
        control={control}
        rules={{ required: "This field is required." }}
        render={({ field, fieldState }) => (
          <FieldInput
            field={field}
            fieldState={fieldState}
            name="scope"
            label="scope"
            onChange={() => {
              if (fieldState.isDirty) {
                trigger("scope");
              }
            }}
          />
        )}
      />
      <ActionButton
        status={operationStatus["createAccount"]?.status}
        label="Create Account"
        className="bg-white text-black"
      />
    </form>
  );
};
