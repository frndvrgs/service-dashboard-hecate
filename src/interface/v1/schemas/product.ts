import { gql } from "graphql-request";
import { STATUS_FRAGMENT } from "./common";

export const LIST_WORKS = gql`
  ${STATUS_FRAGMENT}
  query listWorks($options: OptionsInput) {
    listWorks(options: $options) {
      status {
        ...StatusFields
      }
      output {
        id_work
        id_account
        id_feature
        id_repository
        id_pull_request
        created_at
        updated_at
        name
        repository_name
        pull_request_name
        process_type
        process_status
        level
        document
      }
    }
  }
`;

export const READ_WORK = gql`
  ${STATUS_FRAGMENT}
  query readWork($options: OptionsInput) {
    readWork(options: $options) {
      status {
        ...StatusFields
      }
      output {
        id_work
        id_account
        id_feature
        id_repository
        id_pull_request
        created_at
        updated_at
        name
        repository_name
        pull_request_name
        process_type
        process_status
        level
        document
      }
    }
  }
`;

export const CREATE_WORK = gql`
  ${STATUS_FRAGMENT}
  mutation createWork($feature: ID!, $input: CreateWorkInput!, $account: ID) {
    createWork(feature: $feature, input: $input, account: $account) {
      status {
        ...StatusFields
      }
      output {
        id_work
        id_account
        id_feature
        id_repository
        id_pull_request
        created_at
        updated_at
        name
        repository_name
        pull_request_name
        process_type
        process_status
        level
        document
      }
    }
  }
`;

export const UPDATE_WORK = gql`
  ${STATUS_FRAGMENT}
  mutation updateWork($work: ID!, $input: UpdateWorkInput!, $account: ID) {
    updateWork(work: $work, input: $input, account: $account) {
      status {
        ...StatusFields
      }
      output {
        id_work
        id_account
        id_feature
        id_repository
        id_pull_request
        created_at
        updated_at
        name
        repository_name
        pull_request_name
        process_type
        process_status
        level
        document
      }
    }
  }
`;

export const REMOVE_WORK = gql`
  ${STATUS_FRAGMENT}
  mutation removeWork($work: ID!, $account: ID) {
    removeWork(work: $work, account: $account) {
      status {
        ...StatusFields
      }
    }
  }
`;

export const COMMAND_WORK = gql`
  ${STATUS_FRAGMENT}
  mutation commandWork($work: ID!, $command: String!, $account: ID) {
    commandWork(work: $work, command: $command, account: $account) {
      status {
        ...StatusFields
      }
    }
  }
`;
