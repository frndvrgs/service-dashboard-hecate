import {
  useQuery,
  UseQueryResult,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";

import { graphqlClient } from "@/common/clients/graphql.client";
import type { GraphQLOperation } from "@/common/clients/graphql.client";

export const useGraphQLMutation = <
  T extends keyof GraphQLOperation,
  TVariables extends Record<string, any> = Record<string, any>,
>(
  operationName: T,
  mutation: string,
  options?: UseMutationOptions<GraphQLOperation[T], Error, TVariables>,
): UseMutationResult<GraphQLOperation[T], Error, TVariables> => {
  return useMutation({
    mutationFn: async (variables: TVariables) =>
      await graphqlClient(operationName, mutation, variables),
    ...options,
  });
};

export const useGraphQLQuery = <
  T extends keyof GraphQLOperation,
  TVariables extends Record<string, any> = Record<string, any>,
>(
  operationName: T,
  key: string[],
  query: string,
  variables?: TVariables,
): UseQueryResult<GraphQLOperation[T], Error> => {
  return useQuery({
    queryKey: key,
    queryFn: async () => await graphqlClient(operationName, query, variables),
  });
};
