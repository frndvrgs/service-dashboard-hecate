"use client";

import { useForm, Controller } from "react-hook-form";
import { createFeature } from "@/actions/content";
import { useQueryClient } from "@tanstack/react-query";
import { useServerAction } from "@/hooks/useServerAction";
import { useOperationStatus } from "@/hooks/useOperationStatus";
import { FieldInput } from "@/components/FieldInput";
import { FieldInputList } from "@/components/FieldInputList";
import { ActionButton } from "@/components/ActionButton";

type FormData = API.GraphQL.v1.CreateFeatureInput & { id_account: string };

export const AdminFeatureCreateForm = () => {
  // external hooks
  const queryClient = useQueryClient();
  const { operationStatus, updateOperationStatus } = useOperationStatus();
  const createAction = useServerAction(createFeature);

  const { control, handleSubmit, reset, trigger, setFocus } = useForm<FormData>(
    {
      defaultValues: { name: "", process_type: "", subscription_scope: [] },
    },
  );

  // handlers

  const handleCreateFeature = async (formData: FormData) => {
    const operationName = "createFeature";

    updateOperationStatus(operationName, "loading");

    const { name, subscription_scope, process_type } = formData;

    const { data, error } = await createAction.execute({
      input: {
        name,
        process_type,
        subscription_scope,
      },
    });

    if (error) {
      console.error("create feature error", error);
      updateOperationStatus(operationName, "error", error);
      return;
    }

    if (data?.status.isError) {
      console.error("create feature error", data.status);
      updateOperationStatus(operationName, "error", data.status);
      return;
    }

    if (data) {
      console.log("create feature:", data);
      updateOperationStatus(operationName, "success");
      await queryClient.invalidateQueries({ queryKey: ["features"] });
      setFocus("name");
      reset();
    }
  };

  // rendering

  return (
    <form onSubmit={handleSubmit(handleCreateFeature)} className="space-y-6">
      <Controller
        name="name"
        control={control}
        rules={{
          required: "This field is required.",
        }}
        render={({ field, fieldState }) => (
          <FieldInput
            field={field}
            fieldState={fieldState}
            name="name"
            label="name"
            onChange={() => {
              if (fieldState.isDirty) {
                trigger("name");
              }
            }}
          />
        )}
      />

      <Controller
        name="process_type"
        control={control}
        rules={{
          required: "This field is required.",
        }}
        render={({ field, fieldState }) => (
          <FieldInput
            field={field}
            fieldState={fieldState}
            name="process_type"
            label="process_type"
            placeholder="SOURCE_CODE | PULL_REQUEST"
            onChange={() => {
              if (fieldState.isDirty) {
                trigger("process_type");
              }
            }}
          />
        )}
      />

      <Controller
        name="subscription_scope"
        control={control}
        rules={{ required: "This field is required." }}
        render={({ field, fieldState }) => (
          <FieldInputList
            field={field}
            fieldState={fieldState}
            name="subscription_scope"
            label="subscription_scope"
            onChange={() => {
              if (fieldState.isDirty) {
                trigger("subscription_scope");
              }
            }}
          />
        )}
      />
      <ActionButton
        status={operationStatus["createFeature"]?.status}
        label="Create Feature"
        className="bg-white text-black"
      />
    </form>
  );
};
