"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useGraphQLQuery } from "@/hooks/useGraphQL";
import { useServerAction } from "@/hooks/useServerAction";
import { useOperationStatus } from "@/hooks/useOperationStatus";
import { removeWork } from "@/actions/product";
import { LIST_WORKS } from "@/interface/v1/schemas/product";
import { InfoContainer } from "@/components/InfoContainer";
import { InfoItem } from "@/components/InfoItem";

export const AdminWorkList = () => {
  // external hooks

  const queryClient = useQueryClient();
  const { operationStatus, updateOperationStatus } = useOperationStatus();
  const removeAction = useServerAction(removeWork);

  const listWorksQuery = useGraphQLQuery<
    "listWorks",
    API.GraphQL.v1.listWorksQueryArgs
  >("listWorks", ["works"], LIST_WORKS, {
    options: { order: [{ field: "created_at", direction: "DESC" }] },
  });

  // handlers

  const handleRemoveWork = async (id_account: string, id_work: string) => {
    const operationName = `removeWork_${id_work}`;
    updateOperationStatus(operationName, "loading");

    const { data, error } = await removeAction.execute({
      account: id_account,
      work: id_work,
    });

    if (error) {
      console.error("update work error", error);
      updateOperationStatus(operationName, "error", error);
      return;
    }

    if (data?.status.isError) {
      console.error("update work error", data.status);
      updateOperationStatus(operationName, "error", data.status);
      return;
    }

    if (data) {
      console.log("update work:", data);
      updateOperationStatus(operationName, "success");
      await queryClient.invalidateQueries({ queryKey: ["works"] });
    }
  };

  // fallbacks

  if (listWorksQuery.isLoading)
    return (
      <div className="text-[#6e6e6e] uppercase text-center text-sm">
        loading
      </div>
    );
  if (listWorksQuery.error)
    return (
      <div className="text-red-500 uppercase text-center text-sm">error</div>
    );
  if (!listWorksQuery.data?.output)
    return (
      <div className="text-red-500 uppercase text-center text-sm">
        not found
      </div>
    );

  // rendering

  const data_works = listWorksQuery.data.output;

  return (
    <div className="space-y-6">
      {data_works.map((work) => (
        <InfoContainer
          key={work.id_work}
          showControls
          layout="grid"
          linkHref={`/admin/works/${work.id_work}`}
          linkTitle="Edit Work"
          removeFn={() => handleRemoveWork(work.id_account, work.id_work)}
          removeStatus={operationStatus[`removeWork_${work.id_work}`]?.status}
          removeTitle="Remove Work"
        >
          <InfoItem label="id_work" value={work.id_work} />
          <InfoItem label="id_account" value={work.id_account} />
          <InfoItem label="id_feature" value={work.id_feature} />
          <InfoItem label="id_repository" value={work.id_repository} />
          <InfoItem
            label="created_at"
            value={
              work.created_at
                ? new Date(work.created_at).toLocaleDateString()
                : ""
            }
          />
          <InfoItem
            label="updated_at"
            value={
              work.updated_at
                ? new Date(work.updated_at).toLocaleDateString()
                : ""
            }
          />
          <InfoItem label="name" value={work.name} />
          <InfoItem label="process_type" value={work.process_type} />
          <InfoItem label="process_status" value={work.process_status} />
          <InfoItem label="level" value={`${work.level.toFixed(2)}%`} />
          {work.document?.feature.name && (
            <InfoItem
              label="feature.name"
              value={work.document?.feature.name}
            />
          )}
          {work.document?.feature.type && (
            <InfoItem
              label="feature.type"
              value={work.document?.feature.type}
            />
          )}
          <InfoItem
            label="source.has_code_dump"
            value={
              !!work.document?.source?.has_code_dump ?? false ? "true" : "false"
            }
          />
        </InfoContainer>
      ))}
    </div>
  );
};
