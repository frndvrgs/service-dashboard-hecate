"use client";

import { useGraphQLQuery } from "@/hooks/useGraphQL";
import { LIST_WORKS } from "@/interface/v1/schemas/product";
import { InfoContainer } from "@/components/InfoContainer";
import { InfoItem } from "@/components/InfoItem";

export const DashboardWorkList = () => {
  // external hooks

  const listWorksQuery = useGraphQLQuery<
    "listWorks",
    API.GraphQL.v1.listWorksQueryArgs
  >("listWorks", ["works"], LIST_WORKS, {
    options: { order: [{ field: "created_at", direction: "DESC" }] },
  });

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
          linkHref={`/dashboard/${work.id_work}`}
          linkTitle="Work Settings"
        >
          <InfoItem label="Name" value={work.name} />
          {work.document?.feature.name && (
            <InfoItem label="Feature" value={work.document?.feature.name} />
          )}
          <InfoItem
            label="Allocated Resource Usage"
            value={`${work.level.toFixed(2)}%`}
          />
          {work.pull_request_name && (
            <InfoItem
              label="Pull Request Name"
              value={work.pull_request_name}
            />
          )}
          {work.id_pull_request && (
            <InfoItem label="Pull Request ID" value={work.id_pull_request} />
          )}
          <InfoItem label="Repository Name" value={work.repository_name} />
          <InfoItem label="Repository ID" value={work.id_repository} />

          <InfoItem
            label="Source Code Status"
            value={
              !!work.document?.has_code_dump ?? false
                ? "processed"
                : "not-processed"
            }
          />
        </InfoContainer>
      ))}
    </div>
  );
};
