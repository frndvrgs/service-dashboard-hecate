"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { createWork } from "@/actions/product";
import { fetchAccountGitHub } from "@/actions/account";
import { useQueryClient } from "@tanstack/react-query";
import { useGraphQLQuery } from "@/hooks/useGraphQL";
import { useServerAction } from "@/hooks/useServerAction";
import { useOperationStatus } from "@/hooks/useOperationStatus";
import { READ_ACCOUNT } from "@/interface/v1/schemas/account";
import { LIST_FEATURES } from "@/interface/v1/schemas/content";
import { FieldSelect } from "@/components/FieldSelect";
import { ActionButton } from "@/components/ActionButton";

type FormData = API.GraphQL.v1.CreateWorkInput & {
  id_account: string;
  id_feature: string;
  id_pull_request: string;
};

interface RepositoryOption {
  value: string;
  label: string;
  description?: string;
  name?: string;
}

interface PullRequestOption {
  value: string;
  label: string;
  description?: string;
  name?: string;
  id_repository: string;
}

export const DashboardWorkCreateForm = () => {
  const [repositoryOptions, setRepositoryOptions] = useState<
    RepositoryOption[]
  >([]);
  const [pullRequestOptions, setPullRequestOptions] = useState<
    PullRequestOption[]
  >([]);

  // external hooks
  const queryClient = useQueryClient();
  const { operationStatus, updateOperationStatus } = useOperationStatus();

  const createAction = useServerAction(createWork);
  const fetchGitHub = useServerAction(fetchAccountGitHub);

  const readAccountQuery = useGraphQLQuery<
    "readAccount",
    API.GraphQL.v1.readAccountQueryArgs
  >("readAccount", [`user_account`], READ_ACCOUNT);

  const listFeaturesQuery = useGraphQLQuery<
    "listFeatures",
    API.GraphQL.v1.listFeaturesQueryArgs
  >("listFeatures", ["features"], LIST_FEATURES, {
    options: { order: [{ field: "created_at", direction: "DESC" }] },
  });

  const { control, handleSubmit, reset, setFocus, watch } = useForm<FormData>({
    defaultValues: {
      id_account: "",
      id_feature: "",
      id_repository: "",
      id_pull_request: "",
    },
  });

  // effects

  useEffect(() => {
    if (readAccountQuery.data?.output?.document?.repositories) {
      const repositories = readAccountQuery.data.output.document.repositories;

      const repoOptions = repositories.map(
        (repository: Record<string, any>) => ({
          value: repository.id_repository,
          label: repository.name,
          description: repository.id_repository,
          name: repository.name,
        }),
      );
      setRepositoryOptions(repoOptions);

      const allPullRequests = repositories
        .filter((repository: Record<string, any>) =>
          Array.isArray(repository.pull_requests),
        )
        .flatMap((repository: Record<string, any>) => repository.pull_requests);

      const prOptions = allPullRequests.map((pr: Record<string, any>) => ({
        value: pr.id_pull_request,
        label: pr.title,
        description: pr.id_pull_request,
        name: pr.title,
        id_repository: pr.id_repository,
      }));
      setPullRequestOptions(prOptions);
    }
  }, [readAccountQuery.data]);

  // handlers

  const handleCreateWork = async (formData: FormData) => {
    const operationName = "createWork";

    updateOperationStatus(operationName, "loading");

    const { id_feature, id_repository, id_pull_request } = formData;

    const selectedRepository = repositoryOptions.find(
      (repo) => repo.value === id_repository,
    );

    const selectedPullRequest = pullRequestOptions.find(
      (pr) => pr.value === id_pull_request,
    );

    const { data, error } = await createAction.execute({
      feature: id_feature,
      input: {
        name: `W-${id_repository}`,
        id_repository: id_repository.toString(),
        id_pull_request: id_pull_request?.toString(),
        repository_name: selectedRepository?.name,
        pull_request_name: selectedPullRequest?.name,
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

  const handleFetchGitHub = async (account: string | undefined) => {
    if (!account) return;
    const operationName = "fetchGitHub";

    updateOperationStatus(operationName, "loading");

    const { data, error } = await fetchGitHub.execute({
      account,
    });

    if (error) {
      console.error("fetch github error", error);
      updateOperationStatus(operationName, "error", error);
      return;
    }

    if (data?.status.isError) {
      console.error("fetch github error", data.status);
      updateOperationStatus(operationName, "error", data.status);
      return;
    }

    if (data) {
      console.log("fetch github:", data);
      updateOperationStatus(operationName, "success");
      await queryClient.invalidateQueries({ queryKey: ["user_account"] });
    }
  };

  // rendering

  const selectedRepository = watch("id_repository");
  const selectedFeature = watch("id_feature");

  const pullRequestsAnalysisId = "a3697056-ce94-4dbe-9944-1182b1c54d1f"; // to be improved
  const isPullRequestAnalysis = selectedFeature === pullRequestsAnalysisId;

  const data_account = readAccountQuery.data?.output;
  const data_features = listFeaturesQuery.data?.output;

  return (
    <form onSubmit={handleSubmit(handleCreateWork)} className="space-y-6">
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
            label="Repository"
            options={repositoryOptions}
            placeholder="Select a Repository"
            status={
              readAccountQuery.isLoading
                ? "loading"
                : readAccountQuery.error ||
                    readAccountQuery.data?.status.isError
                  ? "error"
                  : undefined
            }
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
            disabled={!selectedRepository}
            label="Feature"
            options={data_features?.map((feature) => ({
              value: feature.id_feature,
              label: feature.name,
            }))}
            placeholder="Select a Feature"
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
        name="id_pull_request"
        control={control}
        rules={{
          required: isPullRequestAnalysis ? "This field is required." : false,
        }}
        render={({ field, fieldState }) => (
          <FieldSelect
            field={field}
            fieldState={fieldState}
            name="id_pull_request"
            disabled={
              !(pullRequestOptions.length && isPullRequestAnalysis) ||
              !selectedRepository
            }
            label="Pull Request"
            options={pullRequestOptions.filter(
              (pr) => pr.id_repository === selectedRepository,
            )}
            placeholder="Select a Pull Request"
            status={
              readAccountQuery.isLoading
                ? "loading"
                : readAccountQuery.error ||
                    readAccountQuery.data?.status.isError
                  ? "error"
                  : undefined
            }
          />
        )}
      />

      <div className="flex space-x-5">
        <ActionButton
          status={operationStatus["createWork"]?.status}
          label="Create Work"
          className="bg-red-600 text-white hover:bg-red-500"
        />

        <ActionButton
          status={operationStatus["fetchGitHub"]?.status}
          label="Fetch GitHub"
          onClick={() => handleFetchGitHub(data_account?.id_account)}
          className="bg-white text-black"
        />
      </div>
    </form>
  );
};
