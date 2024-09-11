"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useOperationStatus } from "@/hooks/useOperationStatus";
import { useServerAction } from "@/hooks/useServerAction";
import { commandWork } from "@/actions/product";
import {
  CodeBracketIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

interface DashboardWorkCommandPanelProps {
  work: API.GraphQL.v1.Work;
  processType?: string;
}

export const DashboardWorkCommandPanel = ({
  work,
  processType = "SOURCE_CODE",
}: DashboardWorkCommandPanelProps) => {
  const queryClient = useQueryClient();
  const { operationStatus, updateOperationStatus } = useOperationStatus();
  const commandAction = useServerAction(commandWork);

  const handleCommandWork = async (command: string) => {
    const operationName = command;
    updateOperationStatus(operationName, "loading");

    const { data, error } = await commandAction.execute({
      account: work.id_account,
      work: work.id_work,
      command,
    });

    if (error || data?.status.isError) {
      console.error("command work error", error || data?.status);
      updateOperationStatus(operationName, "error", error || data?.status);
      return;
    }

    console.log("command work:", data);
    updateOperationStatus(operationName, "success");
    await queryClient.invalidateQueries({
      queryKey: [`work_${work.id_work}`],
    });
  };

  const hasCodeDump = work.document["has_code_dump"];

  const renderCommandButton = (
    command: string,
    label: string,
    icon: React.ReactNode,
    disabled: boolean = false,
  ) => (
    <button
      onClick={() => handleCommandWork(command)}
      disabled={disabled || operationStatus[command]?.status === "loading"}
      className={`
        flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium
        transition-all duration-200 ease-in-out
        ${disabled ? "bg-gray-300 text-gray-400 cursor-not-allowed" : "bg-red-600 text-white hover:bg-red-500"}
        ${operationStatus[command]?.status === "loading" ? "animate-pulse" : ""}
        ${operationStatus[command]?.status === "error" ? "bg-red-600 hover:bg-red-700" : ""}
        ${operationStatus[command]?.status === "success" ? "bg-green-600 hover:bg-green-700" : ""}
      `}
    >
      {icon}
      <span className="ml-2">{label}</span>
      {operationStatus[command]?.status === "loading" && (
        <span className="ml-2 animate-spin">&#9696;</span>
      )}
    </button>
  );

  return (
    <div>
      <div className="flex justify-end space-x-4">
        {renderCommandButton(
          "dump_source_code",
          `${hasCodeDump ? "Re-Process Context" : "Process Context"}`,
          <CodeBracketIcon className="w-5 h-5" />,
        )}
        {processType === "SOURCE_CODE" ? (
          <>
            {renderCommandButton(
              "analyze_source_code",
              "Analyze Code",
              <MagnifyingGlassIcon className="w-5 h-5" />,
              !hasCodeDump,
            )}
          </>
        ) : (
          <>
            {renderCommandButton(
              "analyze_pull_request",
              "Analyze Pull Request",
              <MagnifyingGlassIcon className="w-5 h-5" />,
              !hasCodeDump,
            )}
          </>
        )}
      </div>
    </div>
  );
};
