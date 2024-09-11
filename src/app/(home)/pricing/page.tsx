"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { CheckIcon } from "@heroicons/react/24/solid";
import { useOperationStatus } from "@/hooks/useOperationStatus";
import { ActionButton } from "@/components/ActionButton";
import { createSubscription } from "@/actions/account";
import { useServerAction } from "@/hooks/useServerAction";

const Pricing = () => {
  const router = useRouter();

  const plans = [
    {
      name: "Basic",
      price: "$99/month",
      features: ["Analyze Source Code", "Analyze Pull Requests"],
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">
          Subscription Plans
        </h1>
        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="border border-[#2d2d2d] rounded-lg p-10 flex flex-col"
            >
              <h2 className="text-2xl font-semibold mb-4">{plan.name}</h2>
              <p className="text-3xl font-bold mb-6">{plan.price}</p>
              <ul className="mb-8 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center mb-3">
                    <CheckIcon className="h-5 w-5 text-red-600 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <ActionButton
                onClick={() => router.push("/account/subscription")}
                label={`Subscribe to ${plan.name}`}
                className="bg-red-600 hover:bg-red-500 text-white w-full"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
