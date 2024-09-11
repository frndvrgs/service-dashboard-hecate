import { useState, useCallback, useRef, useEffect } from "react";
import { debounce } from "lodash-es";

type OperationStatus = "idle" | "loading" | "success" | "error";

interface OperationState {
  status: OperationStatus;
  error: API.GraphQL.v1.Status | null;
}

export function useOperationStatus(debounceDelay: number = 3000) {
  const [operationStatus, setOperationStatus] = useState<
    Record<string, OperationState | undefined>
  >({});
  const clearStatusRef = useRef<Record<string, ReturnType<typeof debounce>>>(
    {},
  );

  useEffect(() => {
    return () => {
      Object.values(clearStatusRef.current).forEach((debounceFn) =>
        debounceFn.cancel(),
      );
    };
  }, []);

  const updateOperationStatus = useCallback(
    (
      operationName: string,
      status: OperationStatus,
      error: API.GraphQL.v1.Status | Error | null = null,
    ) => {
      setOperationStatus((prev) => ({
        ...prev,
        [operationName]: { status, error },
      }));

      if (status === "success" || status === "error") {
        if (!clearStatusRef.current[operationName]) {
          clearStatusRef.current[operationName] = debounce(() => {
            setOperationStatus((prev) => ({
              ...prev,
              [operationName]: { status: "idle", error: null },
            }));
          }, debounceDelay);
        }
        clearStatusRef.current[operationName]();
      }
    },
    [debounceDelay],
  );

  const resetOperationStatus = useCallback((operationName: string) => {
    setOperationStatus((prev) => ({
      ...prev,
      [operationName]: { status: "idle", error: null },
    }));
  }, []);

  return { operationStatus, updateOperationStatus, resetOperationStatus };
}
