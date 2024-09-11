import { useEffect, useState } from "react";
import {
  EllipsisHorizontalCircleIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import type {
  ControllerRenderProps,
  FieldValues,
  ControllerFieldState,
  Path,
} from "react-hook-form";

interface FieldInputListProps<TFieldValues extends FieldValues> {
  field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>;
  fieldState: ControllerFieldState;
  name: Path<TFieldValues>;
  label: string;
  placeholder?: string;
  status?: "idle" | "loading" | "success" | "error";
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onChange?: (value: string[]) => void;
}

export const FieldInputList = <TFieldValues extends FieldValues>({
  field,
  fieldState,
  name,
  label,
  placeholder,
  status,
  onBlur,
  onChange,
}: FieldInputListProps<TFieldValues>) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (Array.isArray(field.value)) {
      setInputValue(field.value.join(", "));
    }
  }, [field.value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const cleanedValue = e.target.value.replace(/[^a-zA-Z0-9,\s]/g, "").trim();
    const valueArray = cleanedValue
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    setInputValue(valueArray.join(", "));
    field.onChange(valueArray);
    onChange && onChange(valueArray);
    field.onBlur();
    onBlur && onBlur(e);
  };

  return (
    <div>
      <label
        htmlFor={name}
        className="block text-[#a1a1a1] text-sm font-medium mb-2"
      >
        {label}
      </label>
      <div
        className={`w-full px-3 py-2 pr-10 bg-[#1a1a1a] focus-within:bg-[#202020] text-white border relative ${
          fieldState.invalid ? "border-red-500" : "border-[#2d2d2d]"
        } rounded-md focus-within:outline-none ${
          status === "loading"
            ? "opacity-30 cursor-progress"
            : status === "error"
              ? "opacity-30 cursor-not-allowed"
              : ""
        }`}
      >
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          disabled={status === "loading" || status === "error"}
          className="w-full bg-transparent outline-none"
        />
        {status && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
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
        )}
      </div>
      {fieldState.error && (
        <p className="mt-1 text-sm text-red-400">{fieldState.error.message}</p>
      )}
    </div>
  );
};
