import { useState } from "react";
import Link from "next/link";
import {
  EllipsisHorizontalCircleIcon,
  ArrowRightCircleIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

type ActionStatus = "idle" | "loading" | "success" | "error";
type Layout = "line" | "grid";

interface InfoContainerProps {
  key?: string;
  showControls?: boolean;
  linkHref?: string;
  linkTitle?: string;
  removeFn?: () => void;
  removeStatus?: ActionStatus;
  removeTitle?: string;
  children: React.ReactNode;
  layout?: Layout;
}

export const InfoContainer = ({
  showControls,
  linkHref,
  linkTitle,
  removeFn,
  removeStatus,
  removeTitle,
  children,
  layout = "line",
}: InfoContainerProps) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRemoveClick = () => {
    setShowConfirm(!showConfirm);
  };

  const handleConfirmRemove = () => {
    if (removeFn) {
      removeFn();
    }
    setShowConfirm(false);
  };

  const contentClasses =
    layout === "grid" ? "grid grid-cols-2 gap-4" : "flex flex-col space-y-4";

  return (
    <div className="bg-[#1a1a1a] border border-[#2d2d2d] rounded-md overflow-hidden relative">
      <div className="p-4 pr-12 border-b border-[#2d2d2d] last:border-b-0">
        <div className={contentClasses}>{children}</div>
        {showControls && (
          <div className="absolute top-2 right-2 flex flex-col space-y-2">
            {linkHref && (
              <Link
                href={linkHref}
                title={linkTitle}
                className="px-1 py-1 bg-transparent text-white rounded-md w-8 h-8 flex items-center justify-center hover:bg-[#2d2d2d] transition-colors focus:outline-none"
              >
                <ArrowRightCircleIcon className="w-6 h-6" />
              </Link>
            )}
            {removeFn && (
              <div
                className={`relative rounded-tr-md rounded-br-md ${showConfirm && "bg-[#222222]"}`}
              >
                <button
                  onClick={handleRemoveClick}
                  disabled={removeStatus === "loading"}
                  title={showConfirm ? "Cancel" : removeTitle}
                  className={`px-1 py-1 bg-transparent text-white ${showConfirm ? "rounded-tr-md rounded-br-md" : "rounded-md"} w-8 h-8 flex items-center justify-center hover:bg-[#2d2d2d] transition-colors focus:outline-none disabled:opacity-30`}
                >
                  {removeStatus === "loading" ? (
                    <EllipsisHorizontalCircleIcon className="w-6 h-6 animate-spin" />
                  ) : showConfirm ? (
                    <XMarkIcon className="w-6 h-6 text-gray-500" />
                  ) : (
                    <TrashIcon className="w-5 h-5 text-white" />
                  )}
                </button>
                {showConfirm && (
                  <div className="absolute top-0 right-8 rounded-tl-md rounded-bl-md bg-[#222222]">
                    <button
                      onClick={handleConfirmRemove}
                      disabled={removeStatus === "loading"}
                      title="Confirm"
                      className="px-1 py-1 bg-transparent text-white rounded-tl-md rounded-bl-md w-8 h-8 flex items-center justify-center hover:bg-[#2d2d2d] transition-colors focus:outline-none disabled:opacity-30"
                    >
                      <TrashIcon className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
