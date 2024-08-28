import {
  useQuery,
  UseQueryResult,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";
import { graphqlClient } from "@/common/graphql/client";

export const useGraphQLQuery = <T>(
  key: string[],
  query: string,
  variables?: Record<string, any>,
): UseQueryResult<T, Error> => {
  return useQuery<T, Error>({
    queryKey: key,
    queryFn: async () => await graphqlClient.request<T>(query, variables),
  });
};

export const useGraphQLMutation = <
  TData = unknown,
  TVariables extends Record<string, any> = Record<string, any>,
>(
  mutation: string,
  options?: UseMutationOptions<TData, Error, TVariables>,
): UseMutationResult<TData, Error, TVariables> => {
  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables: TVariables) =>
      await graphqlClient.request<TData, TVariables>(mutation, variables),
    ...options,
  });
};
