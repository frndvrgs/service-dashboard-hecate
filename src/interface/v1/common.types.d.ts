import type { FindOptionsWhere } from "typeorm";

declare global {
  namespace CommonTypes {
    interface BaseEntity {
      id: number;
    }

    type DescriptionCodes = keyof typeof DESCRIPTION_CODES;
    type StatusCodes = valueof<typeof STATUS_CODES>;

    namespace Payload {
      interface QueryOptions<T> {
        where?: FindOptionsWhere<T> | FindOptionsWhere<T>[];
        order?: {
          [P in keyof T]?:
            | "ASC"
            | "DESC"
            | {
                direction: "ASC" | "DESC";
                nulls?: "NULLS FIRST" | "NULLS LAST";
              };
        };
        relations?: string[];
        select?: (keyof T)[];
        skip?: number;
        take?: number;
        withDeleted?: boolean;
        cache?: boolean | number;
      }

      interface ExceptionInput {
        description: DescriptionCodes;
        code: StatusCodes;
        message?: string;
        detail?: string;
        error?: Error | unknown;
        errors?: AggregateError | unknown;
      }
    }
  }
}
