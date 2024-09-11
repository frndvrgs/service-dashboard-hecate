"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useGraphQLQuery } from "@/hooks/useGraphQL";
import { useServerAction } from "@/hooks/useServerAction";
import { useOperationStatus } from "@/hooks/useOperationStatus";
import { removeSubscription } from "@/actions/account";
import { LIST_SUBSCRIPTIONS } from "@/interface/v1/schemas/account";
import { InfoContainer } from "@/components/InfoContainer";
import { InfoItem } from "@/components/InfoItem";

export const AdminSubscriptionList = () => {
  // external hooks

  const queryClient = useQueryClient();
  const { operationStatus, updateOperationStatus } = useOperationStatus();
  const removeAction = useServerAction(removeSubscription);

  const listSubscriptionsQuery = useGraphQLQuery<
    "listSubscriptions",
    API.GraphQL.v1.listSubscriptionsQueryArgs
  >("listSubscriptions", ["subscriptions"], LIST_SUBSCRIPTIONS, {
    options: { order: [{ field: "created_at", direction: "DESC" }] },
  });

  // handlers

  const handleRemoveSubscription = async (
    id_account: string,
    id_subscription: string,
  ) => {
    const operationName = `removeSubscription_${id_subscription}`;
    updateOperationStatus(operationName, "loading");

    const { data, error } = await removeAction.execute({
      account: id_account,
    });

    if (error) {
      console.error("update subscription error", error);
      updateOperationStatus(operationName, "error", error);
      return;
    }

    if (data?.status.isError) {
      console.error("update subscription error", data.status);
      updateOperationStatus(operationName, "error", data.status);
      return;
    }

    if (data) {
      console.log("update subscription:", data);
      updateOperationStatus(operationName, "success");
      await queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    }
  };

  // fallbacks

  if (listSubscriptionsQuery.isLoading)
    return (
      <div className="text-[#6e6e6e] uppercase text-center text-sm">
        loading
      </div>
    );
  if (listSubscriptionsQuery.error)
    return (
      <div className="text-red-500 uppercase text-center text-sm">error</div>
    );
  if (!listSubscriptionsQuery.data?.output)
    return (
      <div className="text-red-500 uppercase text-center text-sm">
        not found
      </div>
    );

  // rendering

  const data_subscriptions = listSubscriptionsQuery.data.output;

  return (
    <div className="space-y-6">
      {data_subscriptions.map((subscription) => (
        <InfoContainer
          key={subscription.id_subscription}
          showControls
          layout="grid"
          linkHref={`/admin/subscriptions/${subscription.id_subscription}`}
          linkTitle="Edit Subscription"
          removeFn={() =>
            handleRemoveSubscription(
              subscription.id_account,
              subscription.id_subscription,
            )
          }
          removeStatus={
            operationStatus[`removeSubscription_${subscription.id_account}`]
              ?.status
          }
          removeTitle="Remove Subscription"
        >
          <InfoItem
            label="id_subscription"
            value={subscription.id_subscription}
          />
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
      ))}
    </div>
  );
};
