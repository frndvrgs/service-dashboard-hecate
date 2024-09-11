// THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)

export declare global {
  namespace API {
    namespace GraphQL {
      namespace v1 {
        enum DescriptionCodes {
          ACCOUNT_CREATED = "ACCOUNT_CREATED",
          ACCOUNT_REMOVED = "ACCOUNT_REMOVED",
          ACCOUNT_UPDATED = "ACCOUNT_UPDATED",
          COLLECTION_LISTED = "COLLECTION_LISTED",
          DATABASE_CLIENT_ERROR = "DATABASE_CLIENT_ERROR",
          DATABASE_ERROR = "DATABASE_ERROR",
          DUPLICATED = "DUPLICATED",
          EXPIRED_TOKEN = "EXPIRED_TOKEN",
          FEATURE_CREATED = "FEATURE_CREATED",
          FEATURE_REMOVED = "FEATURE_REMOVED",
          FEATURE_UPDATED = "FEATURE_UPDATED",
          GITHUB_API_ERROR = "GITHUB_API_ERROR",
          INACTIVE_TOKEN = "INACTIVE_TOKEN",
          INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
          INVALID_AUTH_SCOPE = "INVALID_AUTH_SCOPE",
          INVALID_AUTH_TOKEN = "INVALID_AUTH_TOKEN",
          INVALID_COMMAND = "INVALID_COMMAND",
          INVALID_INPUT = "INVALID_INPUT",
          INVALID_SESSION = "INVALID_SESSION",
          INVALID_SIGNATURE = "INVALID_SIGNATURE",
          INVALID_SUBSCRIPTION_STATUS = "INVALID_SUBSCRIPTION_STATUS",
          INVALID_SUBSCRIPTION_TYPE = "INVALID_SUBSCRIPTION_TYPE",
          INVALID_VALUE = "INVALID_VALUE",
          INVALID_VALUE_FORMAT = "INVALID_VALUE_FORMAT",
          INVALID_VALUE_LENGTH = "INVALID_VALUE_LENGTH",
          MISSING_ENCRYPTION_KEY = "MISSING_ENCRYPTION_KEY",
          MISSING_PAYLOAD = "MISSING_PAYLOAD",
          NON_NULLABLE_VALUE = "NON_NULLABLE_VALUE",
          NOTHING_FOUND = "NOTHING_FOUND",
          NOT_ALLOWED = "NOT_ALLOWED",
          NOT_AUTHENTICATED = "NOT_AUTHENTICATED",
          NOT_AUTHORIZED = "NOT_AUTHORIZED",
          NOT_FOUND = "NOT_FOUND",
          NOT_UNIQUE_VALUE = "NOT_UNIQUE_VALUE",
          PROFILE_CREATED = "PROFILE_CREATED",
          PROFILE_REMOVED = "PROFILE_REMOVED",
          PROFILE_UPDATED = "PROFILE_UPDATED",
          RESOURCE_READ = "RESOURCE_READ",
          SESSION_CREATED = "SESSION_CREATED",
          SESSION_REMOVED = "SESSION_REMOVED",
          SESSION_VERIFIED = "SESSION_VERIFIED",
          SET_AUTHENTICATION_ERROR = "SET_AUTHENTICATION_ERROR",
          SUBSCRIPTION_CREATED = "SUBSCRIPTION_CREATED",
          SUBSCRIPTION_REMOVED = "SUBSCRIPTION_REMOVED",
          SUBSCRIPTION_UPDATED = "SUBSCRIPTION_UPDATED",
          UNAVAILABLE_FEATURES = "UNAVAILABLE_FEATURES",
          UNKNOWN_ERROR = "UNKNOWN_ERROR",
          VALIDATION_ERROR = "VALIDATION_ERROR",
          WEB_SERVER_ERROR = "WEB_SERVER_ERROR",
          WORKS_LISTED = "WORKS_LISTED",
          WORK_COMMAND_PROCESSED = "WORK_COMMAND_PROCESSED",
          WORK_CREATED = "WORK_CREATED",
          WORK_REMOVED = "WORK_REMOVED",
          WORK_UPDATED = "WORK_UPDATED",
        }

        enum WhereOperator {
          ARRAY_CONTAINS = "ARRAY_CONTAINS",
          ARRAY_CONTAINS_LIKE = "ARRAY_CONTAINS_LIKE",
          EQ = "EQ",
          GT = "GT",
          GTE = "GTE",
          ILIKE = "ILIKE",
          IN = "IN",
          IS_NULL = "IS_NULL",
          LIKE = "LIKE",
          LT = "LT",
          LTE = "LTE",
          NOT = "NOT",
        }

        interface Account {
          created_at: string;
          document?: Record<string, any>;
          email: string[];
          has_github_token: boolean;
          id_account: string;
          scope: string;
          updated_at: string;
        }

        interface AccountResponse {
          output?: Account;
          status: Status;
        }

        interface AccountsResponse {
          output?: Account[];
          status: Status;
        }

        interface CreateFeatureInput {
          document?: Record<string, any>;
          name: string;
          process_type: string;
          subscription_scope: string[];
        }

        interface CreateProfileInput {
          document: Record<string, any>;
        }

        interface CreateSubscriptionInput {
          document?: Record<string, any>;
          status: string;
          type: string;
        }

        interface CreateWorkInput {
          document?: Record<string, any>;
          id_pull_request?: string;
          id_repository: string;
          level?: number;
          name: string;
          pull_request_name?: string;
          repository_name?: string;
        }

        interface Feature {
          created_at: string;
          document?: Record<string, any>;
          id_feature: string;
          name: string;
          process_type: string;
          subscription_scope: string[];
          updated_at: string;
        }

        interface FeatureResponse {
          output?: Feature;
          status: Status;
        }

        interface FeaturesResponse {
          output?: Feature[];
          status: Status;
        }

        interface Mutation {
          commandWork: WorkResponse;
          createFeature: FeatureResponse;
          createProfile: ProfileResponse;
          createSubscription: SubscriptionResponse;
          createWork: WorkResponse;
          fetchAccountGitHub: AccountResponse;
          removeAccount: StatusResponse;
          removeFeature: FeatureResponse;
          removeProfile: ProfileResponse;
          removeSubscription: SubscriptionResponse;
          removeWork: WorkResponse;
          updateAccount: AccountResponse;
          updateFeature: FeatureResponse;
          updateProfile: ProfileResponse;
          updateSubscription: SubscriptionResponse;
          updateWork: WorkResponse;
          upsertAccount: AccountResponse;
        }

        interface OptionsInput {
          cache?: boolean;
          order?: OrderInput[];
          relations?: string[];
          select?: string[];
          skip?: number;
          take?: number;
          where?: WhereInput[];
          withDeleted?: boolean;
        }

        interface OrderInput {
          direction: string;
          field: string;
          nulls?: string;
        }

        interface Profile {
          created_at: string;
          document: Record<string, any>;
          id_account: string;
          id_profile: string;
          name?: string;
          updated_at: string;
          username: string;
        }

        interface ProfileResponse {
          output?: Profile;
          status: Status;
        }

        interface ProfilesResponse {
          output?: Profile[];
          status: Status;
        }

        interface Query {
          listAccounts: AccountsResponse;
          listFeatures: FeaturesResponse;
          listProfiles: ProfilesResponse;
          listSubscriptions: SubscriptionsResponse;
          listWorks: WorksResponse;
          readAccount: AccountResponse;
          readFeature: FeatureResponse;
          readProfile: ProfileResponse;
          readSubscription: SubscriptionResponse;
          readWork: WorkResponse;
        }

        interface Status {
          code?: number;
          context?: string;
          description?: `${DescriptionCodes}`;
          detail?: string;
          isError: boolean;
          message?: string;
          name?: string;
          scope?: string;
          type?: string;
        }

        interface StatusResponse {
          status: Status;
        }

        interface Subscription {
          created_at: string;
          document?: Record<string, any>;
          id_account: string;
          id_subscription: string;
          status: string;
          type: string;
          updated_at: string;
        }

        interface SubscriptionResponse {
          output?: Subscription;
          status: Status;
        }

        interface SubscriptionsResponse {
          output?: Subscription[];
          status: Status;
        }

        interface UpdateAccountInput {
          document?: Record<string, any>;
          email?: string;
          github_token?: string;
          scope?: string;
        }

        interface UpdateFeatureInput {
          document?: Record<string, any>;
          name?: string;
          process_type?: string;
          subscription_scope?: string[];
        }

        interface UpdateProfileInput {
          document?: Record<string, any>;
          name?: string;
          username?: string;
        }

        interface UpdateSubscriptionInput {
          document?: Record<string, any>;
          status?: string;
          type?: string;
        }

        interface UpdateWorkInput {
          document?: Record<string, any>;
          level?: number;
          name?: string;
          process_type?: string;
        }

        interface UpsertAccountInput {
          document?: Record<string, any>;
          email: string;
          scope?: string;
        }

        interface WhereInput {
          conditions?: WhereInput[];
          field?: string;
          operator?: `${WhereOperator}`;
          value?: string;
        }

        interface Work {
          created_at: string;
          document: Record<string, any>;
          has_code_dump: boolean;
          id_account: string;
          id_feature: string;
          id_pull_request?: string;
          id_repository: string;
          id_work: string;
          level: number;
          name: string;
          process_status: string;
          process_type: string;
          pull_request_name?: string;
          repository_name?: string;
          updated_at: string;
        }

        interface WorkResponse {
          output?: Work;
          status: Status;
        }

        interface WorksResponse {
          output?: Work[];
          status: Status;
        }

        interface commandWorkMutationArgs {
          account?: string;
          command: string;
          work: string;
        }

        interface createFeatureMutationArgs {
          input: CreateFeatureInput;
        }

        interface createProfileMutationArgs {
          account?: string;
          input: CreateProfileInput;
        }

        interface createSubscriptionMutationArgs {
          account?: string;
          input: CreateSubscriptionInput;
        }

        interface createWorkMutationArgs {
          account?: string;
          feature: string;
          input: CreateWorkInput;
        }

        interface fetchAccountGitHubMutationArgs {
          account?: string;
        }

        interface removeAccountMutationArgs {
          account?: string;
        }

        interface removeFeatureMutationArgs {
          feature: string;
        }

        interface removeProfileMutationArgs {
          account?: string;
        }

        interface removeSubscriptionMutationArgs {
          account?: string;
        }

        interface removeWorkMutationArgs {
          account?: string;
          work: string;
        }

        interface updateAccountMutationArgs {
          account?: string;
          input: UpdateAccountInput;
        }

        interface updateFeatureMutationArgs {
          feature: string;
          input: UpdateFeatureInput;
        }

        interface updateProfileMutationArgs {
          account?: string;
          input: UpdateProfileInput;
        }

        interface updateSubscriptionMutationArgs {
          account?: string;
          input: UpdateSubscriptionInput;
        }

        interface updateWorkMutationArgs {
          account?: string;
          input: UpdateWorkInput;
          work: string;
        }

        interface upsertAccountMutationArgs {
          input: UpsertAccountInput;
        }

        interface listAccountsQueryArgs {
          options: OptionsInput;
        }

        interface listFeaturesQueryArgs {
          options: OptionsInput;
        }

        interface listProfilesQueryArgs {
          options: OptionsInput;
        }

        interface listSubscriptionsQueryArgs {
          options: OptionsInput;
        }

        interface listWorksQueryArgs {
          options?: OptionsInput;
        }

        interface readAccountQueryArgs {
          options?: OptionsInput;
        }

        interface readFeatureQueryArgs {
          options: OptionsInput;
        }

        interface readProfileQueryArgs {
          options?: OptionsInput;
        }

        interface readSubscriptionQueryArgs {
          options?: OptionsInput;
        }

        interface readWorkQueryArgs {
          options?: OptionsInput;
        }
      }
    }
  }
}
