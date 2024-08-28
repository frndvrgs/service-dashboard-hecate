"use server";

import { settings } from "@/settings";
import { graphqlClient } from "@/common/graphql/client";
import { cookieTools } from "@/common/utils/cookieTools";
import { SYNC_ACCOUNT, LIST_ACCOUNTS } from "@/interface/v1/schemas/account";

const { API } = settings;

export const syncAccount = async (
  email: string,
  details: Record<string, unknown>,
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
        details,
      }),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return console.error("error synchronizing account:", errorData);
    }

    const responseData = await response.json();
    cookieTools.setCookiesFromResponse(response, "user");

    console.log("account successfully synchronized", responseData);
  } catch (error) {
    console.error("syncAccount error:", error);
  }
};

export const syncAccountGraphql = async (
  variables: API.GraphQL.v1.syncAccountMutationArgs,
): Promise<API.GraphQL.v1.Mutation["syncAccount"] | void> => {
  try {
    const response = await graphqlClient.request<
      API.GraphQL.v1.Mutation["syncAccount"],
      API.GraphQL.v1.syncAccountMutationArgs
    >(SYNC_ACCOUNT, variables);
    return response;
  } catch (error) {
    console.error("syncAccount error:", error);
  }
};

export const listAccounts = async (
  variables: API.GraphQL.v1.listAccountsQueryArgs,
): Promise<API.GraphQL.v1.Query["listAccounts"] | void> => {
  try {
    const response = await graphqlClient.request<
      API.GraphQL.v1.Query["listAccounts"],
      API.GraphQL.v1.listAccountsQueryArgs
    >(LIST_ACCOUNTS, variables);
    return response;
  } catch (error) {
    console.error("listAccounts error:", error);
  }
};
