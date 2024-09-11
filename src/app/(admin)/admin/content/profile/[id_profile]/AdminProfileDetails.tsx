"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useServerAction } from "@/hooks/useServerAction";
import { useOperationStatus } from "@/hooks/useOperationStatus";
import { removeProfile } from "@/actions/content";
import { InfoContainer } from "@/components/InfoContainer";
import { InfoItem } from "@/components/InfoItem";

interface AdminProfileDetailsProps {
  profile: API.GraphQL.v1.Profile;
}

export const AdminProfileDetails = ({ profile }: AdminProfileDetailsProps) => {
  // external hooks

  const router = useRouter();
  const queryClient = useQueryClient();
  const { operationStatus, updateOperationStatus } = useOperationStatus();
  const removeAction = useServerAction(removeProfile);

  // handlers

  const handleRemoveProfile = async () => {
    const operationName = "removeProfile";
    updateOperationStatus(operationName, "loading");

    const { data, error } = await removeAction.execute({
      account: profile.id_account,
    });

    if (error) {
      console.error("remove profile error", error);
      updateOperationStatus(operationName, "error", error);
      return;
    }

    if (data?.status.isError) {
      console.error("remove profile error", data.status);
      updateOperationStatus(operationName, "error", data.status);
      return;
    }

    if (data) {
      console.log("remove profile:", data);
      await queryClient.invalidateQueries({ queryKey: ["profiles"] });
      router.push("/admin/profiles");
    }
  };

  // rendering

  return (
    <InfoContainer
      showControls
      removeFn={() => handleRemoveProfile()}
      removeStatus={operationStatus["removeProfile"]?.status}
      removeTitle="Remove Profile"
    >
      <InfoItem label="id_profile" value={profile.id_profile} />
      <InfoItem label="id_account" value={profile.id_account} />
      <InfoItem
        label="created_at"
        value={
          profile.created_at
            ? new Date(profile.created_at).toLocaleDateString()
            : ""
        }
      />
      <InfoItem
        label="updated_at"
        value={
          profile.updated_at
            ? new Date(profile.updated_at).toLocaleDateString()
            : ""
        }
      />
      <InfoItem label="name" value={profile.name} />
      <InfoItem label="username" value={profile.username} />
    </InfoContainer>
  );
};
