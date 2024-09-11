import { cookies } from "next/headers";
import { default as cookieSignature } from "cookie-signature";
import { SignJWT } from "jose";

interface CookieOptions {
  value: string;
  maxAge?: number;
  path?: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

interface ParsedCookies {
  [key: string]: CookieOptions;
}

const createToken = async (
  email: string,
  secret: string | undefined,
  expirationTime: string,
): Promise<string> => {
  if (!secret) {
    throw new Error("missing token secret");
  }

  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expirationTime)
    .setIssuedAt()
    .setNotBefore(Math.floor(Date.now() / 1000))
    .sign(new TextEncoder().encode(secret));
};

const unsignCookieValue = (value: string): string | boolean => {
  const secret = process.env.COOKIE_SECRET;
  if (!secret) return false;
  return cookieSignature.unsign(value, secret);
};

const parseCookieString = (
  cookieString: string,
  userCookieName?: string,
): [string, CookieOptions] => {
  const [nameValue, ...options] = cookieString.split("; ");
  const [name, value] = nameValue.split("=");

  let decodedValue = decodeURIComponent(value);

  // we should decode only user cookies, not the auth (httpOnly)
  if (userCookieName && name === userCookieName) {
    const unsignedValue = unsignCookieValue(decodedValue);
    decodedValue =
      typeof unsignedValue === "string" ? unsignedValue : decodedValue;

    try {
      const [jsonPart] = decodedValue.split(".");
      const cleanedValue = JSON.parse(jsonPart);
      decodedValue = JSON.stringify(cleanedValue);
    } catch (error) {
      console.error("rrror parsing user cookie value:", error);
    }
  }

  const cookieOptions: CookieOptions = { value: decodedValue };

  options.forEach((option) => {
    const [optionName, optionValue] = option.split("=");
    switch (optionName.toLowerCase()) {
      case "max-age":
        cookieOptions.maxAge = parseInt(optionValue);
        break;
      case "path":
        cookieOptions.path = optionValue;
        break;
      case "httponly":
        cookieOptions.httpOnly = true;
        break;
      case "secure":
        cookieOptions.secure = true;
        break;
      case "samesite":
        cookieOptions.sameSite = optionValue.toLowerCase() as
          | "strict"
          | "lax"
          | "none";
        break;
    }
  });

  return [name, cookieOptions];
};

const parseHeader = (
  cookieHeader: string | string[] | undefined | null,
  userCookieName?: string,
): ParsedCookies => {
  if (!cookieHeader) return {};
  const cookieStrings = Array.isArray(cookieHeader)
    ? cookieHeader
    : [cookieHeader];
  return Object.fromEntries(
    cookieStrings.map((cookieString) =>
      parseCookieString(cookieString, userCookieName),
    ),
  );
};

const parseSignedHeader = (
  cookieHeader: string | undefined | null,
  userCookieName?: string,
): ParsedCookies => {
  if (!cookieHeader) return {};
  const cookieStrings = cookieHeader.split(", ");
  return Object.fromEntries(
    cookieStrings.map((cookieString) =>
      parseCookieString(cookieString, userCookieName),
    ),
  );
};

const setCookiesFromResponse = (response: Response, userCookieName: string) => {
  const cookieStore = cookies();
  const cookieHeader = response.headers.get("set-cookie");
  if (cookieHeader) {
    const parsedCookies = cookieTools.parseSignedHeader(
      cookieHeader,
      userCookieName,
    );
    for (const [key, options] of Object.entries(parsedCookies)) {
      cookieStore.set(key, options.value, options);
    }
  }
};

export const cookieTools = {
  parseSignedHeader,
  parseHeader,
  unsignCookieValue,
  createToken,
  setCookiesFromResponse,
};
