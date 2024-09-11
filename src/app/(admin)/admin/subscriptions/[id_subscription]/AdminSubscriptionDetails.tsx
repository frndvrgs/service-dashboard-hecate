"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useServerAction } from "@/hooks/useServerAction";
import { useOperationStatus } from "@/hooks/useOperationStatus";
import { removeSubscription } from "@/actions/account";
import { InfoContainer } from "@/components/InfoContainer";
import { InfoItem } from "@/components/InfoItem";

interface AdminSubscriptionDetailsProps {
  subscription: API.GraphQL.v1.Subscription;
}

export const AdminSubscriptionDetails = ({
  subscription,
}: AdminSubscriptionDetailsProps) => {
  // external hooks

  const router = useRouter();
  const queryClient = useQueryClient();
  const { operationStatus, updateOperationStatus } = useOperationStatus();
  const removeAction = useServerAction(removeSubscription);

  // handlers

  const handleRemoveSubscription = async () => {
    const operationName = "removeSubscription";
    updateOperationStatus(operationName, "loading");

    const { data, error } = await removeAction.execute({
      account: subscription.id_account,
    });

    if (error) {
      console.error("remove subscription error", error);
      updateOperationStatus(operationName, "error", error);
      return;
    }

    if (data?.status.isError) {
      console.error("remove subscription error", data.status);
      updateOperationStatus(operationName, "error", data.status);
      return;
    }

    if (data) {
      console.log("remove subscription:", data);
      await queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      router.push("/admin/subscriptions");
    }
  };

  // rendering

  return (
    <InfoContainer
      showControls
      removeFn={() => handleRemoveSubscription()}
      removeStatus={operationStatus["removeSubscription"]?.status}
      removeTitle="Remove Subscription"
    >
      <InfoItem label="id_subscription" value={subscription.id_subscription} />
      <InfoItem label="id_account" value={subscription.id_account} />
      <InfoItem
        label="created_at"
        value={
          subscription.created_at
            ? new Date(subscription.created_at).toLocaleDateString()
            : ""
        }
      />
      <InfoItem
        label="updated_at"
        value={
          subscription.updated_at
            ? new Date(subscription.updated_at).toLocaleDateString()
            : ""
        }
      />
      <InfoItem label="type" value={subscription.type} />
      <InfoItem label="status" value={subscription.status} />
    </InfoContainer>
  );
};
