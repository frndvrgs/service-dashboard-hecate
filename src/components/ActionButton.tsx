import React from "react";
import {
  EllipsisHorizontalCircleIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";

type ActionStatus = "idle" | "loading" | "success" | "error";

interface ActionButtonProps {
  onClick?: () => void;
  status?: ActionStatus;
  label: string;
  disabled?: boolean;
  className?: string;
}

export const ActionButton = ({
  onClick,
  status,
  label,
  disabled = false,
  className = "",
}: ActionButtonProps) => {
  const baseClassName =
    "py-2 px-4 rounded-md disabled:opacity-30 disabled:cursor-wait focus:outline-none";

  return (
    <div className="flex items-center">
      <button
        type={onClick ? "button" : "submit"}
        onClick={onClick}
        disabled={disabled || status === "loading"}
        className={`${baseClassName} ${className}`}
      >
        {label}
      </button>
      <div className="ml-4">
        {status === "loading" && (
          <EllipsisHorizontalCircleIcon className="w-5 h-5 animate-spin" />
        )}
        {status === "success" && (
          <CheckCircleIcon className="w-5 h-5 text-green-400" />
        )}
        {status === "error" && (
          <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
        )}
      </div>
    </div>
  );
};
