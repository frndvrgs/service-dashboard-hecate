"use server";

import { graphqlClient } from "@/common/clients/graphql.client";
import {
  CREATE_WORK,
  UPDATE_WORK,
  REMOVE_WORK,
  COMMAND_WORK,
} from "@/interface/v1/schemas/product";

export const createWork = async (
  variables: API.GraphQL.v1.createWorkMutationArgs,
): Promise<API.GraphQL.v1.Mutation["createWork"]> => {
  return await graphqlClient("createWork", CREATE_WORK, variables);
};

export const updateWork = async (
  variables: API.GraphQL.v1.updateWorkMutationArgs,
): Promise<API.GraphQL.v1.Mutation["updateWork"]> => {
  return await graphqlClient("updateWork", UPDATE_WORK, variables);
};

export const removeWork = async (
  variables: API.GraphQL.v1.removeWorkMutationArgs,
): Promise<API.GraphQL.v1.Mutation["removeWork"]> => {
  return await graphqlClient("removeWork", REMOVE_WORK, variables);
};

export const commandWork = async (
  variables: API.GraphQL.v1.commandWorkMutationArgs,
): Promise<API.GraphQL.v1.Mutation["commandWork"]> => {
  return await graphqlClient("commandWork", COMMAND_WORK, variables);
};
