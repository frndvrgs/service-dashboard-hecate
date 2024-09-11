"use client";

import { useGraphQLQuery } from "@/hooks/useGraphQL";
import { READ_PROFILE } from "@/interface/v1/schemas/content";
import { Breadcrumb } from "@/components/Breadcrumb";
import { AdminProfileDetails } from "./AdminProfileDetails";
import { AdminProfileUpdateForm } from "./AdminProfileUpdateForm";

interface AdminProfileProps {
  params: { id_profile: string };
}

const AdminProfile = ({ params }: AdminProfileProps) => {
  // external hooks
  const readProfileQuery = useGraphQLQuery<
    "readProfile",
    API.GraphQL.v1.readProfileQueryArgs
  >("readProfile", [`profile_${params.id_profile}`], READ_PROFILE, {
    options: {
      where: [
        { field: "id_profile", operator: "EQ", value: params.id_profile },
      ],
    },
  });

  // rendering

  return (
    <section className="container mx-auto px-4 flex justify-center items-center">
      <div className="w-full max-w-4xl p-8 bg-[#0a0a0a] border border-[#2d2d2d] rounded-lg shadow-lg space-y-6">
        <Breadcrumb
          items={[
            { label: "Content", href: "/admin/content" },
            { label: "Profile" },
            { label: params.id_profile },
          ]}
        />

        {readProfileQuery.isLoading ? (
          <div className="text-[#6e6e6e] uppercase text-center text-sm">
            loading
          </div>
        ) : readProfileQuery.error ? (
          <div className="text-red-500 uppercase text-center text-sm">
            error
          </div>
        ) : !readProfileQuery.data?.output ? (
          <div className="text-red-500 uppercase text-center text-sm">
            not found
          </div>
        ) : (
          <>
            <AdminProfileDetails profile={readProfileQuery.data.output} />
            <AdminProfileUpdateForm profile={readProfileQuery.data.output} />
          </>
        )}
      </div>
    </section>
  );
};

export default AdminProfile;
