"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useGraphQLQuery } from "@/hooks/useGraphQL";
import { useServerAction } from "@/hooks/useServerAction";
import { useOperationStatus } from "@/hooks/useOperationStatus";
import { removeProfile } from "@/actions/content";
import { LIST_PROFILES } from "@/interface/v1/schemas/content";
import { InfoContainer } from "@/components/InfoContainer";
import { InfoItem } from "@/components/InfoItem";

export const AdminProfileList = () => {
  // external hooks

  const queryClient = useQueryClient();
  const { operationStatus, updateOperationStatus } = useOperationStatus();
  const removeAction = useServerAction(removeProfile);

  const listProfilesQuery = useGraphQLQuery<
    "listProfiles",
    API.GraphQL.v1.listProfilesQueryArgs
  >("listProfiles", ["profiles"], LIST_PROFILES, {
    options: { order: [{ field: "created_at", direction: "DESC" }] },
  });

  // handlers

  const handleRemoveProfile = async (
    id_account: string,
    id_profile: string,
  ) => {
    const operationName = `removeProfile_${id_profile}`;
    updateOperationStatus(operationName, "loading");

    const { data, error } = await removeAction.execute({
      account: id_account,
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
      await queryClient.invalidateQueries({ queryKey: ["profiles"] });
    }
  };

  // fallbacks

  if (listProfilesQuery.isLoading)
    return (
      <div className="text-[#6e6e6e] uppercase text-center text-sm">
        loading
      </div>
    );
  if (listProfilesQuery.error)
    return (
      <div className="text-red-500 uppercase text-center text-sm">error</div>
    );
  if (!listProfilesQuery.data?.output)
    return (
      <div className="text-red-500 uppercase text-center text-sm">
        not found
      </div>
    );

  // rendering

  const data_profiles = listProfilesQuery.data.output;

  return (
    <div className="space-y-6">
      {data_profiles.map((profile) => (
        <InfoContainer
          key={profile.id_profile}
          showControls
          layout="grid"
          linkHref={`/admin/content/profile/${profile.id_profile}`}
          linkTitle="Edit Profile"
          removeFn={() =>
            handleRemoveProfile(profile.id_account, profile.id_profile)
          }
          removeStatus={
            operationStatus[`removeProfile_${profile.id_profile}`]?.status
          }
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
      ))}
    </div>
  );
};
