"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useServerAction } from "@/hooks/useServerAction";
import { useOperationStatus } from "@/hooks/useOperationStatus";
import { removeFeature } from "@/actions/content";
import { InfoContainer } from "@/components/InfoContainer";
import { InfoItem } from "@/components/InfoItem";
import { InfoList } from "@/components/InfoList";

interface AdminFeatureDetailsProps {
  feature: API.GraphQL.v1.Feature;
}

export const AdminFeatureDetails = ({ feature }: AdminFeatureDetailsProps) => {
  // external hooks

  const router = useRouter();
  const queryClient = useQueryClient();
  const { operationStatus, updateOperationStatus } = useOperationStatus();
  const removeAction = useServerAction(removeFeature);

  // handlers

  const handleRemoveFeature = async () => {
    const operationName = "removeFeature";
    updateOperationStatus(operationName, "loading");

    const { data, error } = await removeAction.execute({
      feature: feature.id_feature,
    });

    if (error) {
      console.error("remove feature error", error);
      updateOperationStatus(operationName, "error", error);
      return;
    }

    if (data?.status.isError) {
      console.error("remove feature error", data.status);
      updateOperationStatus(operationName, "error", data.status);
      return;
    }

    if (data) {
      console.log("remove feature:", data);
      await queryClient.invalidateQueries({ queryKey: ["features"] });
      router.push("/admin/features");
    }
  };

  // rendering

  return (
    <InfoContainer
      showControls
      removeFn={() => handleRemoveFeature()}
      removeStatus={operationStatus["removeFeature"]?.status}
      removeTitle="Remove Feature"
    >
      <InfoItem label="id_feature" value={feature.id_feature} />
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
      <InfoItem label="name" value={feature.name} />
      <InfoItem label="process_type" value={feature.process_type} />
      <InfoList label="subscription_scope" list={feature.subscription_scope} />
    </InfoContainer>
  );
};
