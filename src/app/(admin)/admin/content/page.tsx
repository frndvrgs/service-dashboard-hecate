"use client";

import { Breadcrumb } from "@/components/Breadcrumb";
import { AdminFeatureList } from "./AdminFeatureList";
import { AdminFeatureCreateForm } from "./AdminFeatureCreateForm";
import { AdminProfileList } from "./AdminProfileList";

const AdminContent = () => {
  return (
    <section className="container mx-auto px-4 flex justify-center items-center">
      <div className="w-full max-w-4xl p-8 bg-[#0a0a0a] border border-[#2d2d2d] rounded-lg shadow-lg space-y-6">
        <Breadcrumb items={[{ label: "Features" }]} />
        <AdminFeatureCreateForm />
        <AdminFeatureList />
        <Breadcrumb items={[{ label: "Profiles" }]} />
        <AdminProfileList />
      </div>
    </section>
  );
};

export default AdminContent;
