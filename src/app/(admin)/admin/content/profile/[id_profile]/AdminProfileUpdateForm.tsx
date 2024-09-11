import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useOperationStatus } from "@/hooks/useOperationStatus";
import { useServerAction } from "@/hooks/useServerAction";
import { updateProfile } from "@/actions/content";
import { FieldInput } from "@/components/FieldInput";
import { isEqual } from "lodash-es";

interface AdminProfileUpdateForm {
  profile: API.GraphQL.v1.Profile;
}

type FormData = API.GraphQL.v1.UpdateProfileInput;

export const AdminProfileUpdateForm = ({ profile }: AdminProfileUpdateForm) => {
  // external hooks
  const queryClient = useQueryClient();
  const { operationStatus, updateOperationStatus } = useOperationStatus();

  const updateAction = useServerAction(updateProfile);

  const profileForm = useForm<FormData>({
    defaultValues: {
      name: "",
      username: "",
    },
    mode: "onBlur",
  });

  // effects

  useEffect(() => {
    if (profile) {
      const { name, username } = profile;
      profileForm.setValue("name", name || "");
      profileForm.setValue("username", username);
    }
  }, [profile, profileForm.setValue]);

  // handlers

  const handleUpdateProfile = async (fieldName: keyof FormData) => {
    if (!(await profileForm.trigger(fieldName))) return;

    const newValue = profileForm.getValues(fieldName);
    const currentValue = profile[fieldName];

    if (isEqual(newValue, currentValue)) return;

    const operationName = `update_${fieldName}`;

    updateOperationStatus(operationName, "loading");

    const { data, error } = await updateAction.execute({
      account: profile.id_account,
      input: { [fieldName]: newValue },
    });

    if (error) {
      console.error("update profile error", error);
      updateOperationStatus(operationName, "error", error);
      return;
    }

    if (data?.status.isError) {
      console.error("update profile error", data.status);
      updateOperationStatus(operationName, "error", data.status);
      return;
    }

    if (data) {
      console.log("update profile:", data);
      updateOperationStatus(operationName, "success");
      await queryClient.invalidateQueries({
        queryKey: ["profiles", `profile_${profile.id_profile}`],
      });
    }
  };

  // rendering

  return (
    <form className="space-y-6">
      <Controller
        name="name"
        control={profileForm.control}
        render={({ field, fieldState }) => (
          <FieldInput
            field={field}
            fieldState={fieldState}
            name="name"
            label="name"
            status={operationStatus["update_name"]?.status}
            onBlur={() => {
              if (fieldState.isDirty) {
                handleUpdateProfile("name");
              }
            }}
          />
        )}
      />
      <Controller
        name="username"
        control={profileForm.control}
        render={({ field, fieldState }) => (
          <FieldInput
            field={field}
            fieldState={fieldState}
            name="username"
            label="username"
            status={operationStatus["update_username"]?.status}
            onBlur={() => {
              if (fieldState.isDirty) {
                handleUpdateProfile("username");
              }
            }}
          />
        )}
      />
    </form>
  );
};
