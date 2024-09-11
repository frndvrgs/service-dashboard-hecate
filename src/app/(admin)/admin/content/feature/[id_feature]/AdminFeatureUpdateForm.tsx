import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useOperationStatus } from "@/hooks/useOperationStatus";
import { useServerAction } from "@/hooks/useServerAction";
import { updateFeature } from "@/actions/content";
import { FieldInput } from "@/components/FieldInput";
import { FieldInputList } from "@/components/FieldInputList";
import { isEqual } from "lodash-es";

interface AdminFeatureUpdateForm {
  feature: API.GraphQL.v1.Feature;
}

type FormData = API.GraphQL.v1.UpdateFeatureInput;

export const AdminFeatureUpdateForm = ({ feature }: AdminFeatureUpdateForm) => {
  // external hooks
  const queryClient = useQueryClient();
  const { operationStatus, updateOperationStatus } = useOperationStatus();

  const updateAction = useServerAction(updateFeature);

  const featureForm = useForm<FormData>({
    defaultValues: {
      name: "",
      subscription_scope: [],
    },
    mode: "onBlur",
  });

  // effects

  useEffect(() => {
    if (feature) {
      const { name, subscription_scope } = feature;
      featureForm.setValue("name", name);
      featureForm.setValue("subscription_scope", subscription_scope);
    }
  }, [feature, featureForm.setValue]);

  // handlers

  const handleUpdateFeature = async (fieldName: keyof FormData) => {
    if (!(await featureForm.trigger(fieldName))) return;

    const newValue = featureForm.getValues(fieldName);
    const currentValue = feature[fieldName];

    if (isEqual(newValue, currentValue)) return;

    const operationName = `update_${fieldName}`;

    updateOperationStatus(operationName, "loading");

    const { data, error } = await updateAction.execute({
      feature: feature.id_feature,
      input: { [fieldName]: newValue },
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
      await queryClient.invalidateQueries({
        queryKey: ["features", `feature_${feature.id_feature}`],
      });
    }
  };

  // rendering

  return (
    <form className="space-y-6">
      <Controller
        name="name"
        control={featureForm.control}
        render={({ field, fieldState }) => (
          <FieldInput
            field={field}
            fieldState={fieldState}
            name="name"
            label="name"
            status={operationStatus["update_name"]?.status}
            onBlur={() => {
              if (fieldState.isDirty) {
                handleUpdateFeature("name");
              }
            }}
          />
        )}
      />
      <Controller
        name="subscription_scope"
        control={featureForm.control}
        rules={{ required: "This field is required." }}
        render={({ field, fieldState }) => (
          <FieldInputList
            field={field}
            fieldState={fieldState}
            name="subscription_scope"
            label="subscription_scope"
            status={operationStatus["update_subscription_scope"]?.status}
            onBlur={() => {
              if (fieldState.isDirty) {
                handleUpdateFeature("subscription_scope");
              }
            }}
          />
        )}
      />
    </form>
  );
};
