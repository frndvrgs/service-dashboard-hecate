"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useServerAction } from "@/hooks/useServerAction";
import { useOperationStatus } from "@/hooks/useOperationStatus";
import { removeWork } from "@/actions/product";
import { InfoContainer } from "@/components/InfoContainer";
import { InfoItem } from "@/components/InfoItem";
import { useWebSocket } from "@/hooks/useWebSocket";

interface AdminWorkDetailsProps {
  work: API.GraphQL.v1.Work;
}

export const AdminWorkDetails = ({ work }: AdminWorkDetailsProps) => {
  // external hooks

  const router = useRouter();
  const queryClient = useQueryClient();
  const { operationStatus, updateOperationStatus } = useOperationStatus();
  const removeAction = useServerAction(removeWork);

  const workSocket = useWebSocket(work.id_work);

  // handlers

  const handleRemoveWork = async () => {
    const operationName = "removeWork";
    updateOperationStatus(operationName, "loading");

    const { data, error } = await removeAction.execute({
      account: work.id_account,
      work: work.id_work,
    });

    if (error) {
      console.error("remove work error", error);
      updateOperationStatus(operationName, "error", error);
      return;
    }

    if (data?.status.isError) {
      console.error("remove work error", data.status);
      updateOperationStatus(operationName, "error", data.status);
      return;
    }

    if (data) {
      console.log("remove work:", data);
      await queryClient.invalidateQueries({ queryKey: ["works"] });
      router.push("/admin/works");
    }
  };

  // rendering

  return (
    <InfoContainer
      showControls
      removeFn={() => handleRemoveWork()}
      removeStatus={operationStatus["removeWork"]?.status}
      removeTitle="Remove Work"
    >
      <InfoItem label="id_work" value={work.id_work} />
      <InfoItem label="id_account" value={work.id_account} />
      <InfoItem label="id_feature" value={work.id_feature} />
      <InfoItem label="id_repository" value={work.id_repository} />
      <InfoItem
        label="created_at"
        value={
          work.created_at ? new Date(work.created_at).toLocaleDateString() : ""
        }
      />
      <InfoItem
        label="updated_at"
        value={
          work.updated_at ? new Date(work.updated_at).toLocaleDateString() : ""
        }
      />
      <InfoItem label="name" value={work.name} />
      <InfoItem label="process_type" value={work.process_type} />
      <InfoItem label="level" value={`${work.level.toFixed(2)}%`} />
      {work.document?.feature.name && (
        <InfoItem label="feature name" value={work.document?.feature.name} />
      )}
      {work.document?.feature.type && (
        <InfoItem label="feature type" value={work.document?.feature.type} />
      )}
      {work.document?.source.id_repository && (
        <InfoItem
          label="source id_repository"
          value={work.document?.source.id_repository}
        />
      )}
      {work.document?.source.has_code_dump && (
        <InfoItem
          label="source has_code_dump"
          value={work.document?.source.has_code_dump}
        />
      )}
      <InfoItem label="process_status" value={workSocket.status || "idle"} />
    </InfoContainer>
  );
};
