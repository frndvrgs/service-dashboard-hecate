"use client";

import { useGraphQLQuery } from "@/hooks/useGraphQL";
import { READ_SUBSCRIPTION } from "@/interface/v1/schemas/account";
import { Breadcrumb } from "@/components/Breadcrumb";
import { AdminSubscriptionDetails } from "./AdminSubscriptionDetails";
import { AdminSubscriptionUpdateForm } from "./AdminSubscriptionUpdateForm";

interface AdminSubscriptionProps {
  params: { id_subscription: string };
}

const AdminSubscription = ({ params }: AdminSubscriptionProps) => {
  // external hooks
  const readSubscriptionQuery = useGraphQLQuery<
    "readSubscription",
    API.GraphQL.v1.readSubscriptionQueryArgs
  >(
    "readSubscription",
    [`subscription_${params.id_subscription}`],
    READ_SUBSCRIPTION,
    {
      options: {
        where: [
          {
            field: "id_subscription",
            operator: "EQ",
            value: params.id_subscription,
          },
        ],
      },
    },
  );

  // rendering

  return (
    <section className="container mx-auto px-4 flex justify-center items-center">
      <div className="w-full max-w-4xl p-8 bg-[#0a0a0a] border border-[#2d2d2d] rounded-lg shadow-lg space-y-6">
        <Breadcrumb
          items={[
            { label: "Subscriptions", href: "/admin/subscriptions" },
            { label: params.id_subscription },
          ]}
        />

        {readSubscriptionQuery.isLoading ? (
          <div className="text-[#6e6e6e] uppercase text-center text-sm">
            loading
          </div>
        ) : readSubscriptionQuery.error ? (
          <div className="text-red-500 uppercase text-center text-sm">
            error
          </div>
        ) : !readSubscriptionQuery.data?.output ? (
          <div className="text-red-500 uppercase text-center text-sm">
            not found
          </div>
        ) : (
          <>
            <AdminSubscriptionDetails
              subscription={readSubscriptionQuery.data.output}
            />
            <AdminSubscriptionUpdateForm
              subscription={readSubscriptionQuery.data.output}
            />
          </>
        )}
      </div>
    </section>
  );
};

export default AdminSubscription;
