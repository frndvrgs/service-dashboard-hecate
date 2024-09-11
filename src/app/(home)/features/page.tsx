import React from "react";
import {
  CodeBracketIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";

const FeatureCard = ({
  title,
  description,
  icon,
}: { title: string; description: string; icon: any }) => (
  <div className="border border-[#2d2d2d] rounded-lg p-10 flex flex-col h-full">
    <div className="flex items-center mb-4">
      {icon}
      <h3 className="text-xl font-semibold ml-3">{title}</h3>
    </div>
    <p className="text-gray-300 flex-grow leading-7">{description}</p>
  </div>
);

const HomeFeatures = () => {
  const features = [
    {
      title: "Analyze Source Code",
      description:
        "Leverage the power of AI to analyze your GitHub repository's source code. Our advanced model contextualizes your entire codebase, providing deep insights into code quality, security vulnerabilities, and performance optimizations. Benefit from automated audits that enhance your development process, ensuring your code meets the highest standards of excellence.",
      icon: <ComputerDesktopIcon className="h-8 w-8 text-red-600" />,
    },
    {
      title: "Analyze Pull Requests",
      description:
        "Revolutionize your code review process with AI-powered pull request analysis. Our system examines the impact of each PR on your codebase, assessing code quality, adherence to patterns, and test coverage. Automatically verify pull requests, identify potential issues, and ensure that every merge contributes positively to your project's integrity and performance.",
      icon: <CodeBracketIcon className="h-8 w-8 text-red-600" />,
    },
  ];

  return (
    <div className="text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">
          AI Powered Code Auditing
        </h1>
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeFeatures;
