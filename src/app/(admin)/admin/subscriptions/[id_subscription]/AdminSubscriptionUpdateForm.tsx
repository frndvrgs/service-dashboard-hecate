import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useOperationStatus } from "@/hooks/useOperationStatus";
import { useServerAction } from "@/hooks/useServerAction";
import { updateSubscription } from "@/actions/account";
import { FieldInput } from "@/components/FieldInput";
import { isEqual } from "lodash-es";

interface AdminSubscriptionUpdateForm {
  subscription: API.GraphQL.v1.Subscription;
}

type FormData = API.GraphQL.v1.UpdateSubscriptionInput;

export const AdminSubscriptionUpdateForm = ({
  subscription,
}: AdminSubscriptionUpdateForm) => {
  // external hooks
  const queryClient = useQueryClient();
  const { operationStatus, updateOperationStatus } = useOperationStatus();

  const updateAction = useServerAction(updateSubscription);

  const subscriptionForm = useForm<FormData>({
    defaultValues: {
      type: "",
      status: "",
    },
    mode: "onBlur",
  });

  // effects

  useEffect(() => {
    if (subscription) {
      const { type, status } = subscription;
      subscriptionForm.setValue("type", type);
      subscriptionForm.setValue("status", status);
    }
  }, [subscription, subscriptionForm.setValue]);

  // handlers

  const handleUpdateSubscription = async (fieldName: keyof FormData) => {
    if (!(await subscriptionForm.trigger(fieldName))) return;

    const newValue = subscriptionForm.getValues(fieldName);
    const currentValue = subscription[fieldName];

    if (isEqual(newValue, currentValue)) return;

    const operationName = `update_${fieldName}`;

    updateOperationStatus(operationName, "loading");

    const { data, error } = await updateAction.execute({
      account: subscription.id_account,
      input: { [fieldName]: newValue },
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
      await queryClient.invalidateQueries({
        queryKey: [
          "subscriptions",
          `subscription_${subscription.id_subscription}`,
        ],
      });
    }
  };

  // rendering

  return (
    <form className="space-y-6">
      <Controller
        name="type"
        control={subscriptionForm.control}
        render={({ field, fieldState }) => (
          <FieldInput
            field={field}
            fieldState={fieldState}
            name="type"
            label="type"
            status={operationStatus["update_type"]?.status}
            onBlur={() => {
              if (fieldState.isDirty) {
                handleUpdateSubscription("type");
              }
            }}
          />
        )}
      />
      <Controller
        name="status"
        control={subscriptionForm.control}
        render={({ field, fieldState }) => (
          <FieldInput
            field={field}
            fieldState={fieldState}
            name="status"
            label="status"
            status={operationStatus["update_status"]?.status}
            onBlur={() => {
              if (fieldState.isDirty) {
                handleUpdateSubscription("status");
              }
            }}
          />
        )}
      />
    </form>
  );
};
