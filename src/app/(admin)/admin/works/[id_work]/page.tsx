"use client";

import { useGraphQLQuery } from "@/hooks/useGraphQL";
import { READ_WORK } from "@/interface/v1/schemas/product";
import { Breadcrumb } from "@/components/Breadcrumb";
import { AdminWorkDetails } from "./AdminWorkDetails";
import { AdminWorkUpdateForm } from "./AdminWorkUpdateForm";

import { InfoItem } from "@/components/InfoItem";

interface AdminWorkProps {
  params: { id_work: string };
}

const AdminWork = ({ params }: AdminWorkProps) => {
  // external hooks
  const readWorkQuery = useGraphQLQuery<
    "readWork",
    API.GraphQL.v1.readWorkQueryArgs
  >("readWork", [`work_${params.id_work}`], READ_WORK, {
    options: {
      where: [
        {
          field: "id_work",
          operator: "EQ",
          value: params.id_work,
        },
      ],
    },
  });

  // rendering

  return (
    <section className="container mx-auto px-4 flex justify-center items-center">
      <div className="w-full max-w-4xl p-8 bg-[#0a0a0a] border border-[#2d2d2d] rounded-lg shadow-lg space-y-6">
        <Breadcrumb
          items={[
            { label: "Works", href: "/admin/works" },
            { label: params.id_work },
          ]}
        />

        {readWorkQuery.isLoading ? (
          <div className="text-[#6e6e6e] uppercase text-center text-sm">
            loading
          </div>
        ) : readWorkQuery.error ? (
          <div className="text-red-500 uppercase text-center text-sm">
            error
          </div>
        ) : !readWorkQuery.data?.output ? (
          <div className="text-red-500 uppercase text-center text-sm">
            not found
          </div>
        ) : (
          <>
            <AdminWorkDetails work={readWorkQuery.data.output} />
            <AdminWorkUpdateForm work={readWorkQuery.data.output} />
            <div className="bg-[#1a1a1a] border border-[#2d2d2d] rounded-md overflow-hidden relative">
              <div className="p-4 pr-12 border-b border-[#2d2d2d] last:border-b-0 space-y-8">
                {readWorkQuery.data.output.document?.sourceAnalysis?.map(
                  (result: { date: string; content: string }) => (
                    <InfoItem
                      key={result.date}
                      label={new Date(result.date).toLocaleDateString()}
                      value={result.content}
                    />
                  ),
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default AdminWork;
