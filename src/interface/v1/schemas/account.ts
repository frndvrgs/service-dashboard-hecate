import { gql } from "graphql-request";

export const SYNC_ACCOUNT = gql`
  mutation syncAccount($input: UpsertAccountInput!) {
    syncAccount(input: $input) {
      status {
        type
        name
        description
        code
        context
        scope
        message
        detail
      }
      output {
        id_account
        created_at
        updated_at
        email
        scope
        document
      }
    }
  }
`;

export const LIST_ACCOUNTS = gql`
  query listAccounts($options: OptionsInput!) {
    listAccounts(options: $options) {
      status {
        type
        name
        description
        code
        context
        scope
        message
        detail
      }
      output {
        id_account
        created_at
        updated_at
        email
        scope
        document
      }
    }
  }
`;
