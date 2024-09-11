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

interface FieldInputProps<TFieldValues extends FieldValues> {
  field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>;
  fieldState: ControllerFieldState;
  name: Path<TFieldValues>;
  label: string;
  type?: string;
  placeholder?: string;
  status?: "idle" | "loading" | "success" | "error";
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputMode?:
    | "text"
    | "search"
    | "email"
    | "tel"
    | "url"
    | "none"
    | "numeric"
    | "decimal";
}

export const FieldInput = <TFieldValues extends FieldValues>({
  field,
  fieldState,
  name,
  label,
  type = "text",
  placeholder,
  status,
  onBlur,
  onChange,
  inputMode = "text",
}: FieldInputProps<TFieldValues>) => {
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
          {...field}
          type={type}
          id={name}
          placeholder={placeholder}
          inputMode={inputMode}
          onBlur={(e) => {
            field.onBlur();
            onBlur && onBlur(e);
          }}
          onChange={(e) => {
            field.onChange(e);
            onChange && onChange(e);
          }}
          disabled={status === "loading" || status === "error"}
          className="w-full bg-transparent outline-none"
        />
        <div
          className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white`}
        >
          {status && (
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
          )}
        </div>
      </div>
      {fieldState.error && (
        <p className="mt-1 text-sm text-red-400">{fieldState.error.message}</p>
      )}
    </div>
  );
};
