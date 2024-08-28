const CMS_HOST = process.env.NEXT_PUBLIC_CMS_HOST;
const CMS_API_ENDPOINT = process.env.NEXT_PUBLIC_CMS_API_ENDPOINT;
const CMS_API_VERSION = process.env.NEXT_PUBLIC_CMS_API_VERSION;

const CMS_API_URL = `${CMS_HOST}${CMS_API_ENDPOINT}${CMS_API_VERSION}`;

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
          SESSION_CREATE: `${CMS_API_URL}/session/create`,
          ACCOUNT_SYNC: `${CMS_API_URL}/account/sync`,
        },
      },
      TOKEN_SECRET: process.env.CMS_TOKEN_SECRET,
    },
  },
};
