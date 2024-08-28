import { GraphQLClient } from "graphql-request";

const clientInstance = new GraphQLClient(
  "http://localhost:3000/api/graphql-proxy",
  {
    credentials: "include", // Importante para enviar cookies
  },
);

const request = async <T, V extends Record<string, any> = Record<string, any>>(
  query: string,
  variables?: V,
): Promise<T> => await clientInstance.request<T>(query, variables);

export const graphqlClient = {
  instance: clientInstance,
  request,
};
