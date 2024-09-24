"use client";

import { useGraphQLQuery } from "@/hooks/useGraphQL";
import { READ_WORK } from "@/interface/v1/schemas/product";
import { Breadcrumb } from "@/components/Breadcrumb";
import { DashboardWorkDetails } from "./DashboardWorkDetails";
import { DashboardWorkCommandPanel } from "./DashboardWorkCommandPanel";
import { DashboardWorkCodeAnalysis } from "./DashboardWorkCodeAnalysis";
import { useWebSocket } from "@/hooks/useWebSocket";

interface AdminWorkProps {
  params: { id_work: string };
}

const DashboardWork = ({ params }: AdminWorkProps) => {
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

  const workSocket = useWebSocket(params.id_work);

  // rendering

  const data_work = readWorkQuery?.data?.output;

  return (
    <section className="container mx-auto px-4 flex justify-center items-start">
      <div className="w-full max-w-8xl p-8 bg-[#0a0a0a] border border-[#2d2d2d] rounded-lg shadow-lg space-y-6">
        <Breadcrumb
          items={[
            { label: "My Works", href: "/dashboard" },
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-6">
              <DashboardWorkDetails
                work={readWorkQuery.data.output}
                workSocket={workSocket}
              />
              <DashboardWorkCommandPanel
                work={readWorkQuery.data.output}
                processType={data_work?.process_type}
              />
            </div>
            <div className="md:col-span-2 space-y-6">
              <Breadcrumb
                items={[
                  {
                    label:
                      data_work?.process_type === "SOURCE_CODE"
                        ? "Source Code Analysis"
                        : "Pull Request Analysis",
                    href: `/dashboard/${data_work?.id_work}`,
                  },
                ]}
              />
              <DashboardWorkCodeAnalysis
                work={readWorkQuery.data.output}
                workSocket={workSocket}
                processType={data_work?.process_type}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DashboardWork;
