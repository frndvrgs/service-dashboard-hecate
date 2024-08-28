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
          INACTIVE_TOKEN = "INACTIVE_TOKEN",
          INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
          INVALID_AUTH_SCOPE = "INVALID_AUTH_SCOPE",
          INVALID_AUTH_TOKEN = "INVALID_AUTH_TOKEN",
          INVALID_INPUT = "INVALID_INPUT",
          INVALID_SESSION = "INVALID_SESSION",
          INVALID_SIGNATURE = "INVALID_SIGNATURE",
          INVALID_SUBSCRIPTION_STATUS = "INVALID_SUBSCRIPTION_STATUS",
          INVALID_SUBSCRIPTION_TYPE = "INVALID_SUBSCRIPTION_TYPE",
          INVALID_VALUE = "INVALID_VALUE",
          INVALID_VALUE_FORMAT = "INVALID_VALUE_FORMAT",
          INVALID_VALUE_LENGTH = "INVALID_VALUE_LENGTH",
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
          created_at: Date;
          document: Record<string, any>;
          email: string[];
          id_account: string;
          scope: string;
          updated_at: Date;
        }

        interface AccountOutput {
          output: Account;
          status: StatusOutput;
        }

        interface AccountsOutput {
          output: Account[];
          status: StatusOutput;
        }

        interface CreateFeatureInput {
          name: string;
          subscriptionScope: string[];
        }

        interface CreateProfileInput {
          name: string;
          username: string;
        }

        interface CreateSubscriptionInput {
          document: Record<string, any>;
          status: string;
          type: string;
        }

        interface CreateWorkInput {
          level: number;
          name: string;
        }

        interface Feature {
          created_at: Date;
          document: Record<string, any>;
          id_feature: string;
          name: string;
          subscriptionScope: string[];
          updated_at: Date;
        }

        interface FeatureOutput {
          output: Feature;
          status: StatusOutput;
        }

        interface FeaturesOutput {
          output: Feature[];
          status: StatusOutput;
        }

        interface Mutation {
          createFeature: FeatureOutput;
          createProfile: ProfileOutput;
          createSubscription: SubscriptionOutput;
          createWork: WorkOutput;
          removeAccount: AccountOutput;
          removeFeature: FeatureOutput;
          removeProfile: ProfileOutput;
          removeSubscription: SubscriptionOutput;
          removeWork: WorkOutput;
          syncAccount: AccountOutput;
          updateAccount: AccountOutput;
          updateFeature: FeatureOutput;
          updateProfile: ProfileOutput;
          updateSubscription: SubscriptionOutput;
          updateWork: WorkOutput;
        }

        interface OptionsInput {
          cache: boolean;
          order: OrderInput[];
          relations: string[];
          select: string[];
          skip: number;
          take: number;
          where: WhereInput[];
          withDeleted: boolean;
        }

        interface OrderInput {
          direction: string;
          field: string;
          nulls: string;
        }

        interface Profile {
          created_at: Date;
          document: Record<string, any>;
          id_account: string;
          id_profile: string;
          name: string;
          updated_at: Date;
          username: string;
        }

        interface ProfileOutput {
          output: Profile;
          status: StatusOutput;
        }

        interface ProfilesOutput {
          output: Profile[];
          status: StatusOutput;
        }

        interface Query {
          listAccounts: AccountsOutput;
          listFeatures: FeaturesOutput;
          listProfiles: ProfilesOutput;
          listSubscriptions: SubscriptionsOutput;
          listWorks: WorksOutput;
          readAccount: AccountOutput;
          readFeature: FeatureOutput;
          readProfile: ProfileOutput;
          readSubscription: SubscriptionOutput;
          readWork: WorkOutput;
        }

        interface StatusOutput {
          code: number;
          context: string;
          description: DescriptionCodes;
          detail: string;
          message: string;
          name: string;
          scope: string;
          type: string;
        }

        interface Subscription {
          created_at: Date;
          document: Record<string, any>;
          id_account: string;
          id_subscription: string;
          status: string;
          type: string;
          updated_at: Date;
        }

        interface SubscriptionOutput {
          output: Subscription;
          status: StatusOutput;
        }

        interface SubscriptionsOutput {
          output: Subscription[];
          status: StatusOutput;
        }

        interface UpdateAccountInput {
          details: Record<string, any>;
          email: string;
        }

        interface UpdateFeatureInput {
          name: string;
          subscriptionScope: string[];
        }

        interface UpdateProfileInput {
          name: string;
          username: string;
        }

        interface UpdateSubscriptionInput {
          document: Record<string, any>;
          status: string;
          type: string;
        }

        interface UpdateWorkInput {
          level: number;
          name: string;
        }

        interface UpsertAccountInput {
          details: Record<string, any>;
          email: string[];
        }

        interface WhereInput {
          conditions: WhereInput[];
          field: string;
          operator: WhereOperator;
          value: string;
        }

        interface Work {
          created_at: Date;
          document: Record<string, any>;
          id_account: string;
          id_feature: string;
          id_work: string;
          level: number;
          name: string;
          updated_at: Date;
        }

        interface WorkOutput {
          output: Work;
          status: StatusOutput;
        }

        interface WorksOutput {
          output: Work[];
          status: StatusOutput;
        }

        interface createFeatureMutationArgs {
          input: CreateFeatureInput;
        }

        interface createProfileMutationArgs {
          account: string;
          input: CreateProfileInput;
        }

        interface createSubscriptionMutationArgs {
          account: string;
          input: CreateSubscriptionInput;
        }

        interface createWorkMutationArgs {
          account: string;
          feature: string;
          input: CreateWorkInput;
        }

        interface removeAccountMutationArgs {
          account: string;
        }

        interface removeFeatureMutationArgs {
          feature: string;
        }

        interface removeProfileMutationArgs {
          profile: string;
        }

        interface removeSubscriptionMutationArgs {
          subscription: string;
        }

        interface removeWorkMutationArgs {
          work: string;
        }

        interface syncAccountMutationArgs {
          input: UpsertAccountInput;
        }

        interface updateAccountMutationArgs {
          account: string;
          input: UpdateAccountInput;
        }

        interface updateFeatureMutationArgs {
          feature: string;
          input: UpdateFeatureInput;
        }

        interface updateProfileMutationArgs {
          input: UpdateProfileInput;
          profile: string;
        }

        interface updateSubscriptionMutationArgs {
          input: UpdateSubscriptionInput;
          subscription: string;
        }

        interface updateWorkMutationArgs {
          input: UpdateWorkInput;
          work: string;
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
          options: OptionsInput;
        }

        interface readAccountQueryArgs {
          options: OptionsInput;
        }

        interface readFeatureQueryArgs {
          options: OptionsInput;
        }

        interface readProfileQueryArgs {
          options: OptionsInput;
        }

        interface readSubscriptionQueryArgs {
          options: OptionsInput;
        }

        interface readWorkQueryArgs {
          options: OptionsInput;
        }
      }
    }
  }
}
