import { clamp, toNumber } from "lodash-es";
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

interface FieldInputNumericProps<TFieldValues extends FieldValues> {
  field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>;
  fieldState: ControllerFieldState;
  name: Path<TFieldValues>;
  label: string;
  placeholder?: string;
  status?: "idle" | "loading" | "success" | "error";
  inputMode?: "numeric" | "decimal";
  max?: number;
  min?: number;
  precision?: number;
  scale?: number;
  trigger?: () => void;
}

export const FieldInputNumeric = <TFieldValues extends FieldValues>({
  field,
  fieldState,
  name,
  label,
  placeholder,
  status,
  inputMode = "decimal",
  max = Number.MAX_SAFE_INTEGER,
  min = Number.MIN_SAFE_INTEGER,
  precision = 5,
  scale = 2,
  trigger,
}: FieldInputNumericProps<TFieldValues>) => {
  const formatValue = (value: number): number => {
    const clampedValue = clamp(value, min, max);
    return Number(clampedValue.toFixed(scale));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const regex = new RegExp(
      `^\\d{0,${precision - scale}}(\\.\\d{0,${scale}})?$`,
    );
    if (regex.test(inputValue)) {
      field.onChange(inputValue);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const rawValue = toNumber(e.target.value);
    const formattedValue = isNaN(rawValue) ? min : formatValue(rawValue);
    field.onChange(formattedValue);
    field.onBlur();
    trigger && trigger();
  };

  return (
    <div>
      <label
        htmlFor={name}
        className="block text-[#a1a1a1] text-sm font-medium mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <input
          {...field}
          value={field.value.toString()}
          type="text"
          id={name}
          placeholder={placeholder}
          onBlur={handleBlur}
          onChange={handleChange}
          inputMode={inputMode}
          className={`w-full px-3 py-2 pr-10 bg-[#1a1a1a] focus:bg-[#202020] text-white border ${
            fieldState.invalid ? "border-red-500" : "border-[#2d2d2d]"
          } rounded-md placeholder-white placeholder-opacity-20 focus:outline-none`}
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
