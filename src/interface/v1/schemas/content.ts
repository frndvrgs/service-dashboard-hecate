import { gql } from "graphql-request";
import { STATUS_FRAGMENT } from "./common";

export const LIST_PROFILES = gql`
  ${STATUS_FRAGMENT}
  query listProfiles($options: OptionsInput!) {
    listProfiles(options: $options) {
      status {
        ...StatusFields
      }
      output {
        id_profile
        id_account
        created_at
        updated_at
        name
        username
        document
      }
    }
  }
`;

export const READ_PROFILE = gql`
  ${STATUS_FRAGMENT}
  query readProfile($options: OptionsInput) {
    readProfile(options: $options) {
      status {
        ...StatusFields
      }
      output {
        id_profile
        id_account
        created_at
        updated_at
        name
        username
        document
      }
    }
  }
`;

export const CREATE_PROFILE = gql`
  ${STATUS_FRAGMENT}
  mutation createProfile($account: ID, $input: CreateProfileInput!) {
    createProfile(account: $account, input: $input) {
      status {
        ...StatusFields
      }
      output {
        id_profile
        id_account
        created_at
        updated_at
        name
        username
        document
      }
    }
  }
`;

export const UPDATE_PROFILE = gql`
  ${STATUS_FRAGMENT}
  mutation updateProfile($account: ID, $input: UpdateProfileInput!) {
    updateProfile(account: $account, input: $input) {
      status {
        ...StatusFields
      }
      output {
        id_profile
        id_account
        created_at
        updated_at
        name
        username
        document
      }
    }
  }
`;

export const REMOVE_PROFILE = gql`
  ${STATUS_FRAGMENT}
  mutation removeProfile($account: ID) {
    removeProfile(account: $account) {
      status {
        ...StatusFields
      }
    }
  }
`;

export const LIST_FEATURES = gql`
  ${STATUS_FRAGMENT}
  query listFeatures($options: OptionsInput!) {
    listFeatures(options: $options) {
      status {
        ...StatusFields
      }
      output {
        id_feature
        created_at
        updated_at
        name
        process_type
        subscription_scope
        document
      }
    }
  }
`;

export const READ_FEATURE = gql`
  ${STATUS_FRAGMENT}
  query readFeature($options: OptionsInput!) {
    readFeature(options: $options) {
      status {
        ...StatusFields
      }
      output {
        id_feature
        created_at
        updated_at
        name
        process_type
        subscription_scope
        document
      }
    }
  }
`;

export const CREATE_FEATURE = gql`
  ${STATUS_FRAGMENT}
  mutation createFeature($input: CreateFeatureInput!) {
    createFeature(input: $input) {
      status {
        ...StatusFields
      }
      output {
        id_feature
        created_at
        updated_at
        name
        process_type
        subscription_scope
        document
      }
    }
  }
`;

export const UPDATE_FEATURE = gql`
  ${STATUS_FRAGMENT}
  mutation updateFeature($feature: ID!, $input: UpdateFeatureInput!) {
    updateFeature(feature: $feature, input: $input) {
      status {
        ...StatusFields
      }
      output {
        id_feature
        created_at
        updated_at
        name
        process_type
        subscription_scope
        document
      }
    }
  }
`;

export const REMOVE_FEATURE = gql`
  ${STATUS_FRAGMENT}
  mutation removeFeature($feature: ID!) {
    removeFeature(feature: $feature) {
      status {
        ...StatusFields
      }
    }
  }
`;
