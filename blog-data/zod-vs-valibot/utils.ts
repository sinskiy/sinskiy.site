import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  FlatErrors,
} from "valibot";
import { z } from "zod/v4";
import type { infer as inferSchema } from "zod/v4-mini";
import type { $ZodFlattenedError } from "zod/v4/core";

export type ZodValidationError<T> = $ZodFlattenedError<z.infer<T>> | null;
export type ZodMiniValidationError<T> = $ZodFlattenedError<
  inferSchema<T>
> | null;
export type ValibotValidationError<
  T extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
> = FlatErrors<T> | null;
