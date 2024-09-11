"use client";

import { Breadcrumb } from "@/components/Breadcrumb";
import { DashboardWorkCreateForm } from "./DashboardWorkCreateForm";
import { DashboardWorkList } from "./DashboardWorkList";

const DashboardWorks = () => {
  return (
    <section className="container mx-auto px-4 flex justify-center items-center">
      <div className="w-full max-w-4xl p-8 bg-[#0a0a0a] border border-[#2d2d2d] rounded-lg shadow-lg space-y-6">
        <Breadcrumb items={[{ label: "My Works" }]} />
        <DashboardWorkCreateForm />
        <DashboardWorkList />
      </div>
    </section>
  );
};

export default DashboardWorks;
