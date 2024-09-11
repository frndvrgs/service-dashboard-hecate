import { gql } from "graphql-request";

export const STATUS_FRAGMENT = gql`
  fragment StatusFields on Status {
    type
    name
    description
    code
    context
    scope
    message
    detail
    isError
  }
`;
