"use client";

import { useGraphQLQuery } from "@/hooks/useGraphQL";
import { READ_FEATURE } from "@/interface/v1/schemas/content";
import { Breadcrumb } from "@/components/Breadcrumb";
import { AdminFeatureDetails } from "./AdminFeatureDetails";
import { AdminFeatureUpdateForm } from "./AdminFeatureUpdateForm";

interface AdminFeatureProps {
  params: { id_feature: string };
}

const AdminFeature = ({ params }: AdminFeatureProps) => {
  // external hooks
  const readFeatureQuery = useGraphQLQuery<
    "readFeature",
    API.GraphQL.v1.readFeatureQueryArgs
  >("readFeature", [`feature_${params.id_feature}`], READ_FEATURE, {
    options: {
      where: [
        { field: "id_feature", operator: "EQ", value: params.id_feature },
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
            { label: "Feature" },
            { label: params.id_feature },
          ]}
        />

        {readFeatureQuery.isLoading ? (
          <div className="text-[#6e6e6e] uppercase text-center text-sm">
            loading
          </div>
        ) : readFeatureQuery.error ? (
          <div className="text-red-500 uppercase text-center text-sm">
            error
          </div>
        ) : !readFeatureQuery.data?.output ? (
          <div className="text-red-500 uppercase text-center text-sm">
            not found
          </div>
        ) : (
          <>
            <AdminFeatureDetails feature={readFeatureQuery.data.output} />
            <AdminFeatureUpdateForm feature={readFeatureQuery.data.output} />
          </>
        )}
      </div>
    </section>
  );
};

export default AdminFeature;
