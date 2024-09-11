import React, { useState, useRef, useEffect } from "react";
import {
  EllipsisHorizontalCircleIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import type {
  ControllerRenderProps,
  FieldValues,
  ControllerFieldState,
  Path,
} from "react-hook-form";

interface Option {
  value: string;
  label: string;
  description?: string;
  name?: string;
}

interface FieldSelectProps<TFieldValues extends FieldValues> {
  field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>;
  fieldState: ControllerFieldState;
  name: Path<TFieldValues>;
  label: string;
  options?: Option[];
  placeholder?: string;
  disabled?: boolean;
  status?: "idle" | "loading" | "success" | "error";
  onBlur?: (event: React.FocusEvent<HTMLDivElement>) => void;
  onChange?: (value: string) => void;
}

export const FieldSelect = <TFieldValues extends FieldValues>({
  field,
  fieldState,
  name,
  label,
  options,
  placeholder,
  disabled,
  status,
  onBlur,
  onChange,
}: FieldSelectProps<TFieldValues>) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (value: string) => {
    field.onChange(value);
    onChange && onChange(value);
    setIsOpen(false);
  };

  const selectedOption = options?.find(
    (option) => option.value === field.value,
  );

  return (
    <div>
      <label
        htmlFor={name}
        className="block text-[#a1a1a1] text-sm font-medium mb-2"
      >
        {label}
      </label>
      <div className="relative" ref={dropdownRef}>
        <div
          id={name}
          tabIndex={0}
          onBlur={(e) => {
            field.onBlur();
            onBlur && onBlur(e);
          }}
          onClick={() =>
            !(disabled || status === "error" || status === "loading") &&
            setIsOpen(!isOpen)
          }
          className={`w-full px-3 py-2 pr-10 bg-[#1a1a1a] focus:bg-[#202020] text-white border ${
            fieldState.invalid ? "border-red-500" : "border-[#2d2d2d]"
          } rounded-md focus:outline-none ${
            disabled || status === "loading" || status === "error"
              ? "opacity-30 cursor-not-allowed"
              : "cursor-pointer"
          }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
          {status ? (
            <div className="mr-2">
              {status === "loading" && (
                <EllipsisHorizontalCircleIcon className="w-5 h-5 animate-spin" />
              )}
              {status === "success" && (
                <CheckCircleIcon className="w-5 h-5 text-green-400" />
              )}
              {status === "error" && (
                <ExclamationCircleIcon className="w-5 h-5 text-red-400" />
              )}
            </div>
          ) : (
            <div className={`mr-2 ${disabled && "opacity-30"}`}>
              {isOpen ? (
                <ChevronUpIcon className="w-5 h-5 text-white" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 text-white" />
              )}
            </div>
          )}
        </div>
        {isOpen && !disabled && (
          <div className="absolute z-10 w-full mt-1 bg-[#1a1a1a] border border-[#2d2d2d] rounded-md shadow-lg overflow-hidden">
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {options?.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`px-3 py-2 cursor-pointer hover:bg-[#202020] flex items-center justify-between text-sm ${
                    option.value === field.value ? "bg-[#151515]" : ""
                  }`}
                >
                  <span className="text-white">{option.label}</span>
                  {option.description && (
                    <span className="text-[#666666]">{option.description}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {fieldState.error && (
        <p className="mt-1 text-sm text-red-400">{fieldState.error.message}</p>
      )}
    </div>
  );
};
