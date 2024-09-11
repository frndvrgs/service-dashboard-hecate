"use server";

import { graphqlClient } from "@/common/clients/graphql.client";
import {
  CREATE_PROFILE,
  UPDATE_PROFILE,
  REMOVE_PROFILE,
  CREATE_FEATURE,
  UPDATE_FEATURE,
  REMOVE_FEATURE,
} from "@/interface/v1/schemas/content";

export const createProfile = async (
  variables: API.GraphQL.v1.createProfileMutationArgs,
): Promise<API.GraphQL.v1.Mutation["createProfile"]> => {
  return await graphqlClient("createProfile", CREATE_PROFILE, variables);
};

export const updateProfile = async (
  variables: API.GraphQL.v1.updateProfileMutationArgs,
): Promise<API.GraphQL.v1.Mutation["updateProfile"]> => {
  return await graphqlClient("updateProfile", UPDATE_PROFILE, variables);
};

export const removeProfile = async (
  variables: API.GraphQL.v1.removeProfileMutationArgs,
): Promise<API.GraphQL.v1.Mutation["removeProfile"]> => {
  return await graphqlClient("removeProfile", REMOVE_PROFILE, variables);
};

export const createFeature = async (
  variables: API.GraphQL.v1.createFeatureMutationArgs,
): Promise<API.GraphQL.v1.Mutation["createFeature"]> => {
  return await graphqlClient("createFeature", CREATE_FEATURE, variables);
};

export const updateFeature = async (
  variables: API.GraphQL.v1.updateFeatureMutationArgs,
): Promise<API.GraphQL.v1.Mutation["updateFeature"]> => {
  return await graphqlClient("updateFeature", UPDATE_FEATURE, variables);
};

export const removeFeature = async (
  variables: API.GraphQL.v1.removeFeatureMutationArgs,
): Promise<API.GraphQL.v1.Mutation["removeFeature"]> => {
  return await graphqlClient("removeFeature", REMOVE_FEATURE, variables);
};
