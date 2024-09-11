"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { createWork } from "@/actions/product";
import { useQueryClient } from "@tanstack/react-query";
import { useGraphQLQuery } from "@/hooks/useGraphQL";
import { useServerAction } from "@/hooks/useServerAction";
import { useOperationStatus } from "@/hooks/useOperationStatus";
import { LIST_ACCOUNTS } from "@/interface/v1/schemas/account";
import { LIST_FEATURES } from "@/interface/v1/schemas/content";
import { FieldInput } from "@/components/FieldInput";
import { FieldInputNumeric } from "@/components/FieldInputNumeric";
import { FieldSelect } from "@/components/FieldSelect";
import { ActionButton } from "@/components/ActionButton";

type FormData = API.GraphQL.v1.CreateWorkInput & {
  id_account: string;
  id_feature: string;
};

export const AdminWorkCreateForm = () => {
  // external hooks
  const queryClient = useQueryClient();
  const { operationStatus, updateOperationStatus } = useOperationStatus();

  const createAction = useServerAction(createWork);

  const [repositories, setRepositories] = useState<
    { value: string; label: string; description: string }[]
  >([]);

  const listAccountsQuery = useGraphQLQuery<
    "listAccounts",
    API.GraphQL.v1.listAccountsQueryArgs
  >("listAccounts", ["accounts"], LIST_ACCOUNTS, {
    options: { order: [{ field: "created_at", direction: "DESC" }] },
  });

  const listFeaturesQuery = useGraphQLQuery<
    "listFeatures",
    API.GraphQL.v1.listFeaturesQueryArgs
  >("listFeatures", ["features"], LIST_FEATURES, {
    options: { order: [{ field: "created_at", direction: "DESC" }] },
  });

  const { control, handleSubmit, reset, trigger, setFocus, watch } =
    useForm<FormData>({
      defaultValues: {
        id_account: "",
        id_feature: "",
        id_repository: "",
        name: "",
        level: 0,
      },
    });

  // effects

  const selectedAccount = watch("id_account");

  useEffect(() => {
    if (selectedAccount && listAccountsQuery.data?.output) {
      const account = listAccountsQuery.data.output.find(
        (acc) => acc.id_account === selectedAccount,
      );
      if (account?.document?.repositories) {
        const options = account.document.repositories.map(
          (repository: Record<string, any>) => ({
            value: repository.id,
            label: repository.name,
            description: repository.id,
          }),
        );
        setRepositories(options);
      } else {
        setRepositories([]);
      }
    } else {
      setRepositories([]);
    }
  }, [selectedAccount, listAccountsQuery.data]);

  // handlers

  const handleCreateWork = async (formData: FormData) => {
    const operationName = "createWork";

    updateOperationStatus(operationName, "loading");

    const { id_account, id_feature, id_repository, name, level } = formData;

    const { data, error } = await createAction.execute({
      account: id_account,
      feature: id_feature,
      input: {
        id_repository: id_repository.toString(),
        name,
        level,
      },
    });

    if (error) {
      console.error("create work error", error);
      updateOperationStatus(operationName, "error", error);
      return;
    }

    if (data?.status.isError) {
      console.error("create work error", data.status);
      updateOperationStatus(operationName, "error", data.status);
      return;
    }

    if (data) {
      console.log("create work:", data);
      updateOperationStatus(operationName, "success");
      await queryClient.invalidateQueries({ queryKey: ["works"] });
      setFocus("id_account");
      reset();
    }
  };

  // rendering

  return (
    <form onSubmit={handleSubmit(handleCreateWork)} className="space-y-6">
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
        name="id_repository"
        control={control}
        rules={{
          required: "This field is required.",
        }}
        render={({ field, fieldState }) => (
          <FieldSelect
            field={field}
            fieldState={fieldState}
            name="id_repository"
            label="repository"
            options={repositories}
            placeholder="select a repository"
            disabled={!repositories.length || !selectedAccount}
          />
        )}
      />

      <Controller
        name="id_feature"
        control={control}
        rules={{
          required: "This field is required.",
        }}
        render={({ field, fieldState }) => (
          <FieldSelect
            field={field}
            fieldState={fieldState}
            name="id_feature"
            label="feature"
            options={
              listFeaturesQuery.data?.output
                ? listFeaturesQuery.data.output.map((feature) => ({
                    value: feature.id_feature,
                    label: feature.id_feature,
                    description: feature.name,
                  }))
                : []
            }
            placeholder="select a feature"
            status={
              listFeaturesQuery.isLoading
                ? "loading"
                : listFeaturesQuery.error ||
                    listFeaturesQuery.data?.status.isError
                  ? "error"
                  : undefined
            }
          />
        )}
      />

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
        name="level"
        control={control}
        render={({ field, fieldState }) => (
          <FieldInputNumeric
            field={field}
            fieldState={fieldState}
            name="level"
            label="level"
            inputMode="decimal"
            min={0}
            max={99.99}
            precision={4}
            scale={2}
            trigger={() => trigger("level")}
          />
        )}
      />
      <ActionButton
        status={operationStatus["createWork"]?.status}
        label="Create Work"
        className="bg-white text-black"
      />
    </form>
  );
};
