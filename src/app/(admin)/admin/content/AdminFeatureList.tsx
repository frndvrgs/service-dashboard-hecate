"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useGraphQLQuery } from "@/hooks/useGraphQL";
import { useServerAction } from "@/hooks/useServerAction";
import { useOperationStatus } from "@/hooks/useOperationStatus";
import { removeFeature } from "@/actions/content";
import { LIST_FEATURES } from "@/interface/v1/schemas/content";
import { InfoContainer } from "@/components/InfoContainer";
import { InfoItem } from "@/components/InfoItem";
import { InfoList } from "@/components/InfoList";

export const AdminFeatureList = () => {
  // external hooks

  const queryClient = useQueryClient();
  const { operationStatus, updateOperationStatus } = useOperationStatus();
  const removeAction = useServerAction(removeFeature);

  const listFeaturesQuery = useGraphQLQuery<
    "listFeatures",
    API.GraphQL.v1.listFeaturesQueryArgs
  >("listFeatures", ["features"], LIST_FEATURES, {
    options: { order: [{ field: "created_at", direction: "DESC" }] },
  });

  // handlers

  const handleRemoveFeature = async (id_feature: string) => {
    const operationName = `removeFeature_${id_feature}`;
    updateOperationStatus(operationName, "loading");

    const { data, error } = await removeAction.execute({
      feature: id_feature,
    });

    if (error) {
      console.error("update feature error", error);
      updateOperationStatus(operationName, "error", error);
      return;
    }

    if (data?.status.isError) {
      console.error("update feature error", data.status);
      updateOperationStatus(operationName, "error", data.status);
      return;
    }

    if (data) {
      console.log("update feature:", data);
      updateOperationStatus(operationName, "success");
      await queryClient.invalidateQueries({ queryKey: ["features"] });
    }
  };

  // fallbacks

  if (listFeaturesQuery.isLoading)
    return (
      <div className="text-[#6e6e6e] uppercase text-center text-sm">
        loading
      </div>
    );
  if (listFeaturesQuery.error)
    return (
      <div className="text-red-500 uppercase text-center text-sm">error</div>
    );
  if (!listFeaturesQuery.data?.output)
    return (
      <div className="text-red-500 uppercase text-center text-sm">
        not found
      </div>
    );

  // rendering

  const data_features = listFeaturesQuery.data.output;

  return (
    <div className="space-y-6">
      {data_features.map((feature) => (
        <InfoContainer
          key={feature.id_feature}
          showControls
          layout="grid"
          linkHref={`/admin/content/feature/${feature.id_feature}`}
          linkTitle="Edit Feature"
          removeFn={() => handleRemoveFeature(feature.id_feature)}
          removeStatus={
            operationStatus[`removeFeature_${feature.id_feature}`]?.status
          }
          removeTitle="Remove Feature"
        >
          <InfoItem label="id_feature" value={feature.id_feature} />
          <InfoItem label="name" value={feature.name} />
          <InfoItem
            label="created_at"
            value={
              feature.created_at
                ? new Date(feature.created_at).toLocaleDateString()
                : ""
            }
          />
          <InfoItem
            label="updated_at"
            value={
              feature.updated_at
                ? new Date(feature.updated_at).toLocaleDateString()
                : ""
            }
          />
          <InfoList
            label="subscription_scope"
            list={feature.subscription_scope}
          />
          <InfoItem label="process_type" value={feature.process_type} />
        </InfoContainer>
      ))}
    </div>
  );
};
