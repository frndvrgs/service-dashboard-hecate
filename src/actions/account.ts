"use server";

import { settings } from "@/settings";
import { graphqlClient } from "@/common/clients/graphql.client";
import { cookieTools } from "@/common/helpers/cookieTools";
import {
  UPSERT_ACCOUNT,
  UPDATE_ACCOUNT,
  REMOVE_ACCOUNT,
  FETCH_ACCOUNT_GITHUB,
  CREATE_SUBSCRIPTION,
  UPDATE_SUBSCRIPTION,
  REMOVE_SUBSCRIPTION,
} from "@/interface/v1/schemas/account";

const { API } = settings;

export const syncAccount = async (
  email: string,
  document: Record<string, unknown>,
): Promise<void> => {
  try {
    // creating oauth account sync JWT token, 10 minutes expiration
    const secret = API.CMS.TOKEN_SECRET;
    const oauthToken = await cookieTools.createToken(email, secret, "10m");

    const response = await fetch(`${API.CMS.ENDPOINT.PUBLIC.ACCOUNT_SYNC}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${oauthToken}`,
      },
      body: JSON.stringify({
        email,
        document,
      }),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return console.error("error synchronizing account:", errorData);
    }

    const data = await response.json();
    cookieTools.setCookiesFromResponse(response, "user");

    console.log("account successfully synchronized", data);
    return data;
  } catch (error) {
    console.error("syncAccount error:", error);
  }
};

export const createAccount = async (
  variables: API.GraphQL.v1.upsertAccountMutationArgs,
): Promise<API.GraphQL.v1.Mutation["upsertAccount"]> => {
  return await graphqlClient("upsertAccount", UPSERT_ACCOUNT, variables);
};

export const updateAccount = async (
  variables: API.GraphQL.v1.updateAccountMutationArgs,
): Promise<API.GraphQL.v1.Mutation["updateAccount"]> => {
  return await graphqlClient("updateAccount", UPDATE_ACCOUNT, variables);
};

export const removeAccount = async (
  variables: API.GraphQL.v1.removeAccountMutationArgs,
): Promise<API.GraphQL.v1.Mutation["removeAccount"]> => {
  return await graphqlClient("removeAccount", REMOVE_ACCOUNT, variables);
};

export const fetchAccountGitHub = async (
  variables: API.GraphQL.v1.fetchAccountGitHubMutationArgs,
): Promise<API.GraphQL.v1.Mutation["fetchAccountGitHub"]> => {
  return await graphqlClient(
    "fetchAccountGitHub",
    FETCH_ACCOUNT_GITHUB,
    variables,
  );
};

export const createSubscription = async (
  variables: API.GraphQL.v1.createSubscriptionMutationArgs,
): Promise<API.GraphQL.v1.Mutation["createSubscription"]> => {
  return await graphqlClient(
    "createSubscription",
    CREATE_SUBSCRIPTION,
    variables,
  );
};

export const updateSubscription = async (
  variables: API.GraphQL.v1.updateSubscriptionMutationArgs,
): Promise<API.GraphQL.v1.Mutation["updateSubscription"]> => {
  return await graphqlClient(
    "updateSubscription",
    UPDATE_SUBSCRIPTION,
    variables,
  );
};

export const removeSubscription = async (
  variables: API.GraphQL.v1.removeSubscriptionMutationArgs,
): Promise<API.GraphQL.v1.Mutation["removeSubscription"]> => {
  return await graphqlClient(
    "removeSubscription",
    REMOVE_SUBSCRIPTION,
    variables,
  );
};
