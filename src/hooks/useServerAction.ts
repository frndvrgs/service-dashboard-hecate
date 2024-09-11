import { useCallback } from "react";

export function useServerAction<F extends (...args: any[]) => Promise<any>>(
  serverAction: F,
) {
  type Params = Parameters<F>[0];
  type Result = Awaited<ReturnType<F>>;

  const execute = useCallback(
    async (
      params: Params,
    ): Promise<{
      data: Result | null;
      error: Error | null;
    }> => {
      try {
        const result = await serverAction(params);
        return { data: result, error: null };
      } catch (error) {
        return { data: null, error: error as Error };
      }
    },
    [serverAction],
  );

  return { execute };
}
