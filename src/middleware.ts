import { NextResponse } from "next/server";
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { settings } from "./settings";

interface VerifiedIdentity {
  scope: {
    user: boolean;
    service: boolean;
  };
}

async function verifyIdentity(
  request: NextRequestWithAuth,
): Promise<VerifiedIdentity> {
  const cookieString = request.headers.get("cookie") || "";

  try {
    const response = await fetch(
      settings.API.CMS.ENDPOINT.PUBLIC.SESSION_VERIFY,
      {
        method: "GET",
        headers: {
          Cookie: cookieString,
        },
        credentials: "include",
      },
    );

    if (!response.ok) {
      console.error("identity verification failed:", response.statusText);
      throw new Error("session verification failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("error verifying identity:", error);
    throw new Error("identity verification failed");
  }
}

export default withAuth(
  async function middleware(request: NextRequestWithAuth) {
    const token = request.nextauth.token;
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (request.nextUrl.pathname.startsWith("/admin")) {
      try {
        const identity = await verifyIdentity(request);
        if (!identity?.scope?.service) {
          return NextResponse.redirect(new URL("/", request.url));
        }
      } catch (error) {
        console.error("error verifying service scope:", error);
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: ["/dashboard/:path*", "/account/:path*", "/admin/:path*"],
};
