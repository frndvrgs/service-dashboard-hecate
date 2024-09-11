"use client"

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { CheckIcon } from "@heroicons/react/24/solid";
import { useOperationStatus } from "@/hooks/useOperationStatus";
import { ActionButton } from "@/components/ActionButton";
import { createSubscription } from "@/actions/account";
import { useServerAction } from "@/hooks/useServerAction";

export const AccountCreateSubscription = () => {

  const queryClient = useQueryClient();
  const { operationStatus, updateOperationStatus } = useOperationStatus();
  const createSubscriptionAction = useServerAction(createSubscription);

  const handleCreateSubscription = async (plan: string) => {
    const operationName = `createSubscription_${plan}`;
    updateOperationStatus(operationName, "loading");

    const { data, error } = await createSubscriptionAction.execute({ input: { type: plan, status: 'active'} });

    if (error || data?.status.isError) {
      console.error("create subscription error", error);
      updateOperationStatus(operationName, "error", error || data?.status);
      return;
    }

    if (data) {
      console.log("create subscription:", data);
      await queryClient.invalidateQueries({ queryKey: ["user_subscription"] });
    }
  };

  const plans = [
    {
      name: "Basic",
      price: "$99/month",
      features: [
        "Analyze Source Code",
        "Analyze Pull Requests"
      ],
    },
    {
      name: "Enterprise",
      price: "$499/month",
      features: [
        "Analyze Source Code",
        "Analyze Pull Requests",
        "Automated analysis with webhooks",
        "Real-time updates",
        "Email notifications",
      ],
    },
  ];

  return (
    <div className="text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">Choose Your Plan</h1>
        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <div key={plan.name} className="bg-[#141414] rounded-lg p-8 flex flex-col">
              <h2 className="text-2xl font-semibold mb-4">{plan.name}</h2>
              <p className="text-3xl font-bold mb-6">{plan.price}</p>
              <ul className="mb-8 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center mb-3">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <ActionButton
                onClick={() => handleCreateSubscription(plan.name.toLowerCase())}
                label={`Subscribe to ${plan.name}`}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                status={operationStatus[`createSubscription_${plan.name.toLowerCase()}`]?.status}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
