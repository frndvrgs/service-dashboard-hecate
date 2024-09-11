"use client";

import { useState, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import {
  EllipsisHorizontalCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { useQueryClient } from "@tanstack/react-query";
import { Breadcrumb } from "@/components/Breadcrumb";

import type { Socket } from "socket.io-client";

interface DashboardWorkCodeAnalysisProps {
  work: API.GraphQL.v1.Work;
  workSocket: {
    socket: Socket | null;
    command: 'dump_source_code' | 'analyze_source_code' | 'analyze_pull_request' | null;
    status: string | null;
    data: Record<string, any> | null;
    error: Record<string, any> | null;
  };
  processType?: string
}

interface AnalysisItem {
  date: string;
  content: string;
}

export const DashboardWorkCodeAnalysis = ({
  work,
  workSocket,
  processType = 'SOURCE_CODE'
}: DashboardWorkCodeAnalysisProps) => {
  const [analyses, setAnalyses] = useState<AnalysisItem[]>([]);
  const [openAnalyses, setOpenAnalyses] = useState<Set<number>>(new Set([0]));
  const queryClient = useQueryClient();

  useEffect(() => {
    setAnalyses(work.document?.sourceAnalysis?.slice().reverse() || []);
  }, [work.document?.sourceAnalysis]);

  useEffect(() => {
    if (workSocket.status === "completed") {
      if (workSocket.data?.command === "dump_source_code") {
        console.log("invalidating query", `work_${work.id_work}`);
        queryClient.invalidateQueries({ queryKey: [`work_${work.id_work}`] });
      } else if (workSocket.data?.content?.content) {
        const newAnalysis: AnalysisItem = {
          date: workSocket.data.content.date,
          content: workSocket.data.content.content,
        };
        setAnalyses((prevAnalyses) => [newAnalysis, ...prevAnalyses]);
        setOpenAnalyses(new Set([0]));
      }
    }
  }, [
    workSocket.status,
    workSocket.command,
    workSocket.data,
    work.id_work,
    queryClient,
  ]);

  const commandDescription = {
    dump_source_code: 'Processing Context',
    analyze_source_code: 'Analyzing Source Code',
    analyze_pull_request: 'Analyzing Pull Request'
  }

  const renderStatusIcon = () => {
    if (workSocket.command) {
      if (workSocket.status === "error") {
        return <ExclamationCircleIcon className="w-6 h-6 text-red-500" />;
      }
      return (
        <div className="flex space-x-2 justify-center">
          <span className="text-[#777] animate-pulse">{commandDescription[workSocket.command]}</span>
          <EllipsisHorizontalCircleIcon className="w-6 h-6 animate-spin text-white" />
        </div>
      );
    }
    return null;
  };

  const toggleAccordion = (index: number) => {
    setOpenAnalyses((prev) => {
      const newSet = new Set(prev);
      if (index === 0) {
        newSet.add(0);
      } else if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const renderSteps = () => {
    const steps = [
      {
        label: "Process Source Code",
        description:
          "To begin the code analysis process, click the 'Process Context' button on the left panel. This crucial step creates the necessary code context for our AI-powered code analysis based on the files in your repository.",
        active: !work.document?.has_code_dump,
      },
      {
        label: processType === 'SOURCE_CODE' ? "Analyze Source Code" : "Analyze Pull Request",
        description:
          "After processing, click on the 'Analyze Code' button to create your first code analysis.",
        active: work.document?.has_code_dump && analyses.length === 0,
      },
      {
        label: "(Optional) Re-Process Source Code",
        description:
          "If you make any changes to your repository, click on 'Re-Process Code' to update your next code analysis.",
        active: work.document?.has_code_dump,
      },
    ];

    return (
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`p-4 border border-[#2d2d2d] bg-[#161616] rounded-md ${
              step.active ? "opacity-100" : "opacity-30"
            }`}
          >
            <h3 className="text-lg font-semibold text-white mb-2">
              Step {index + 1}: {step.label}
            </h3>
            <p className="text-gray-300">{step.description}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    if (!work.document?.has_code_dump || analyses.length === 0) {
      return renderSteps();
    }

    return (
      <div className="space-y-4">
        {analyses.map((analysis, index) => (
          <div
            key={index}
            className="bg-[#0f0f0f] rounded-md overflow-hidden border border-[#2d2d2d]"
          >
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full text-left p-4 flex justify-between items-center hover:bg-[#1a1a1a] transition-colors duration-200"
            >
              <span className="text-sm text-gray-400">
                {new Date(analysis.date).toLocaleString()}
              </span>
              <ChevronDownIcon
                className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${
                  openAnalyses.has(index) ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openAnalyses.has(index) ? "max-h-[600px]" : "max-h-0"
              }`}
            >
              <div className="p-4 bg-[#1a1a1a] text-white whitespace-pre-wrap overflow-y-auto max-h-[600px]">
                {analysis.content}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 relative">
  <div className="absolute -top-16 right-0">{renderStatusIcon()}</div>
            <div className="bg-[#1a1a1a] border border-[#2d2d2d] rounded-md overflow-hidden ">
      <div className="p-4 border-b border-[#2d2d2d] last:border-b-0">

        <div >
          
          {processType === 'PULL_REQUEST' && (
            <div className="mb-4">
              <span className="text-xl" >{work.pull_request_name}</span>
            </div>
          )}
          {renderContent()}
        </div>
      </div>
    </div>
    </div>

  );
};
