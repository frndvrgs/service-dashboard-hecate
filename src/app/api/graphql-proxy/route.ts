import { NextRequest, NextResponse } from "next/server";
import { GraphQLClient } from "graphql-request";
import { cookies } from "next/headers";
import { settings } from "@/settings";

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const authCookie = cookieStore.get("auth");
  const userCookie = cookieStore.get("user");

  const cookieString = [
    authCookie && `auth=${authCookie.value}`,
    userCookie && `user=${userCookie.value}`,
  ]
    .filter(Boolean)
    .join("; ");

  const client = new GraphQLClient(settings.API.CMS.ENDPOINT.PUBLIC.GRAPHQL, {
    credentials: "include",
    headers: {
      cookie: cookieString,
    },
  });

  try {
    const body = await request.json();
    const { query, variables } = body;

    const response = await client.request(query, variables);
    return NextResponse.json({ data: response });
  } catch (error) {
    console.error("GraphQL proxy error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
