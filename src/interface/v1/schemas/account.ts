import { gql } from "graphql-request";
import { STATUS_FRAGMENT } from "./common";

export const LIST_ACCOUNTS = gql`
  ${STATUS_FRAGMENT}
  query listAccounts($options: OptionsInput!) {
    listAccounts(options: $options) {
      status {
        ...StatusFields
      }
      output {
        id_account
        created_at
        updated_at
        email
        scope
        document
        has_github_token
      }
    }
  }
`;

export const READ_ACCOUNT = gql`
  ${STATUS_FRAGMENT}
  query readAccount($options: OptionsInput) {
    readAccount(options: $options) {
      status {
        ...StatusFields
      }
      output {
        id_account
        created_at
        updated_at
        email
        scope
        document
        has_github_token
      }
    }
  }
`;

export const UPSERT_ACCOUNT = gql`
  ${STATUS_FRAGMENT}
  mutation upsertAccount($input: UpsertAccountInput!) {
    upsertAccount(input: $input) {
      status {
        ...StatusFields
      }
      output {
        id_account
        created_at
        updated_at
        email
        scope
        document
        has_github_token
      }
    }
  }
`;

export const UPDATE_ACCOUNT = gql`
  ${STATUS_FRAGMENT}
  mutation updateAccount($account: ID, $input: UpdateAccountInput!) {
    updateAccount(account: $account, input: $input) {
      status {
        ...StatusFields
      }
      output {
        id_account
        created_at
        updated_at
        email
        scope
        document
        has_github_token
      }
    }
  }
`;

export const REMOVE_ACCOUNT = gql`
  ${STATUS_FRAGMENT}
  mutation removeAccount($account: ID!) {
    removeAccount(account: $account) {
      status {
        ...StatusFields
      }
    }
  }
`;

export const FETCH_ACCOUNT_GITHUB = gql`
  ${STATUS_FRAGMENT}
  mutation fetchAccountGitHub($account: ID) {
    fetchAccountGitHub(account: $account) {
      status {
        ...StatusFields
      }
      output {
        id_account
        created_at
        updated_at
        email
        scope
        document
        has_github_token
      }
    }
  }
`;

export const LIST_SUBSCRIPTIONS = gql`
  ${STATUS_FRAGMENT}
  query listSubscriptions($options: OptionsInput!) {
    listSubscriptions(options: $options) {
      status {
        ...StatusFields
      }
      output {
        id_subscription
        id_account
        created_at
        updated_at
        status
        type
        document
      }
    }
  }
`;

export const READ_SUBSCRIPTION = gql`
  ${STATUS_FRAGMENT}
  query readSubscription($options: OptionsInput) {
    readSubscription(options: $options) {
      status {
        ...StatusFields
      }
      output {
        id_subscription
        id_account
        created_at
        updated_at
        status
        type
        document
      }
    }
  }
`;

export const CREATE_SUBSCRIPTION = gql`
  ${STATUS_FRAGMENT}
  mutation createSubscription($account: ID, $input: CreateSubscriptionInput!) {
    createSubscription(account: $account, input: $input) {
      status {
        ...StatusFields
      }
      output {
        id_subscription
        id_account
        created_at
        updated_at
        status
        type
        document
      }
    }
  }
`;

export const UPDATE_SUBSCRIPTION = gql`
  ${STATUS_FRAGMENT}
  mutation updateSubscription($account: ID, $input: UpdateSubscriptionInput!) {
    updateSubscription(account: $account, input: $input) {
      status {
        ...StatusFields
      }
      output {
        id_subscription
        id_account
        created_at
        updated_at
        status
        type
        document
      }
    }
  }
`;

export const REMOVE_SUBSCRIPTION = gql`
  ${STATUS_FRAGMENT}
  mutation removeSubscription($account: ID) {
    removeSubscription(account: $account) {
      status {
        ...StatusFields
      }
    }
  }
`;
