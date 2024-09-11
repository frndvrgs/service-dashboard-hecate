const CMS_HOST = process.env.NEXT_PUBLIC_CMS_HOST || "http://127.0.0.1:20110";
const CMS_API_ENDPOINT = process.env.NEXT_PUBLIC_CMS_API_ENDPOINT || "/api";
const CMS_API_VERSION = process.env.NEXT_PUBLIC_CMS_API_VERSION || "/v1";
const CMS_SOCKETS_HOST =
  process.env.NEXT_PUBLIC_CMS_SOCKETS_HOST || "ws://127.0.0.1:20110";
const CMS_SOCKETS_ENDPOINT =
  process.env.NEXT_PUBLIC_CMS_SOCKETS_ENDPOINT || "/audit";

const CMS_API_URL = `${CMS_HOST}${CMS_API_ENDPOINT}${CMS_API_VERSION}`;
const CMS_API_SOCKETS_URL = `${CMS_SOCKETS_HOST}${CMS_SOCKETS_ENDPOINT}`;

export const settings = {
  APP: {
    SERVICE_NAME: "service-dashboard-hecate",
  },
  API: {
    CMS: {
      HOST: CMS_API_URL,
      VERSION: CMS_API_VERSION,
      ENDPOINT: {
        PUBLIC: {
          GRAPHQL: `${CMS_API_URL}/graphql`,
          SOCKETS: CMS_API_SOCKETS_URL,
          SESSION_CREATE: `${CMS_API_URL}/session/create`,
          SESSION_VERIFY: `${CMS_API_URL}/session/verify`,
          ACCOUNT_SYNC: `${CMS_API_URL}/account/sync`,
        },
      },
      TOKEN_SECRET: process.env.CMS_TOKEN_SECRET,
    },
  },
};
