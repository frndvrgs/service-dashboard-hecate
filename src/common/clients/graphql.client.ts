"use server";

import { GraphQLClient } from "graphql-request";
import { cookies } from "next/headers";
import { settings } from "@/settings";

const COOKIE_NAMES = {
  AUTH: "auth",
  USER: "user",
};

export type GraphQLOperation = API.GraphQL.v1.Mutation & API.GraphQL.v1.Query;

const fetchGraphql = async <T>(
  query: string,
  variables?: Record<string, any>,
): Promise<T> => {
  const cookieStore = cookies();
  const cookieString = [COOKIE_NAMES.AUTH, COOKIE_NAMES.USER]
    .map((name) => {
      const cookie = cookieStore.get(name);
      return cookie ? `${name}=${cookie.value}` : null;
    })
    .filter(Boolean)
    .join("; ");

  const graphqlClient = new GraphQLClient(
    settings.API.CMS.ENDPOINT.PUBLIC.GRAPHQL,
    {
      credentials: "include",
      headers: {
        cookie: cookieString,
      },
    },
  );

  return await graphqlClient.request<T>(query, variables);
};

export async function graphqlClient<T extends keyof GraphQLOperation>(
  operationName: T,
  query: string,
  variables?: Record<string, any>,
): Promise<GraphQLOperation[T]> {
  const response = await fetchGraphql<{ [K in T]: GraphQLOperation[T] }>(
    query,
    variables,
  );

  if (response && operationName in response) {
    return response[operationName];
  }

  throw new Error("invalid response structure");
}
