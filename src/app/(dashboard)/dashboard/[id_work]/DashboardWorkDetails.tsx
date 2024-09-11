"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useServerAction } from "@/hooks/useServerAction";
import { useOperationStatus } from "@/hooks/useOperationStatus";
import { removeWork } from "@/actions/product";
import { InfoContainer } from "@/components/InfoContainer";
import { InfoItem } from "@/components/InfoItem";

import type { Socket } from "socket.io-client";

interface DashboardWorkDetailsProps {
  work: API.GraphQL.v1.Work;
  workSocket: {
    socket: Socket | null;
    command: string | null;
    status: string | null;
    data: Record<string, any> | null;
    error: Record<string, any> | null;
  };
}

export const DashboardWorkDetails = ({
  work,
  workSocket,
}: DashboardWorkDetailsProps) => {
  // external hooks

  const router = useRouter();
  const queryClient = useQueryClient();
  const { operationStatus, updateOperationStatus } = useOperationStatus();
  const removeAction = useServerAction(removeWork);

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
      router.push("/dashboard/works");
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
      <InfoItem label="Name" value={work.name} />
      <InfoItem
        label="Allocated Resource Usage"
        value={`${work.level.toFixed(2)}%`}
      />
      <InfoItem label="ID" value={work.id_work} />
      <InfoItem
        label="Creation Date"
        value={
          work.created_at ? new Date(work.created_at).toLocaleDateString() : ""
        }
      />
      <InfoItem
        label="Update Date"
        value={
          work.created_at ? new Date(work.updated_at).toLocaleDateString() : ""
        }
      />
      <InfoItem label="Repository Name" value={work.repository_name} />
      <InfoItem label="GitHub Repository ID" value={work.id_repository} />
      {work.document?.feature.name && (
        <InfoItem label="Feature" value={work.document?.feature.name} />
      )}
      <InfoItem
        label="Context Status"
        value={
          !!work.document?.has_code_dump ?? false
            ? "processed"
            : "not-processed"
        }
      />
      <InfoItem
        label="Actual Process"
        value={
          workSocket.command
            ? `${workSocket.command} - ${workSocket.status}`
            : "idle"
        }
      />
    </InfoContainer>
  );
};
