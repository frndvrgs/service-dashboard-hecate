"use client";

import { useGraphQLQuery } from "@/hooks/useGraphQL";
import { READ_SUBSCRIPTION } from "@/interface/v1/schemas/account";
import { Breadcrumb } from "@/components/Breadcrumb";
import { AccountSubscriptionDetails } from "./AccountSubscriptionDetails";
import { AccountCreateSubscription } from "./AccountCreateSubscription";

const Subscription = () => {
  // external hooks
  const readSubscriptionQuery = useGraphQLQuery<
    "readSubscription",
    API.GraphQL.v1.readSubscriptionQueryArgs
  >("readSubscription", [`user_subscription`], READ_SUBSCRIPTION);

  // rendering

  return (
    <section className="container mx-auto px-4 flex justify-center items-center">
      <div className="w-full max-w-4xl p-8 bg-[#0a0a0a] border border-[#2d2d2d] rounded-lg shadow-lg space-y-6">
        <Breadcrumb items={[{ label: "Subscription" }]} />

        {readSubscriptionQuery.isLoading ? (
          <div className="text-[#6e6e6e] uppercase text-center text-sm">
            loading
          </div>
        ) : readSubscriptionQuery.error ? (
          <div className="text-red-500 uppercase text-center text-sm">
            error
          </div>
        ) : !readSubscriptionQuery.data?.output ? (
          <AccountCreateSubscription />
        ) : (
          <AccountSubscriptionDetails
            subscription={readSubscriptionQuery.data.output}
          />
        )}
      </div>
    </section>
  );
};

export default Subscription;
