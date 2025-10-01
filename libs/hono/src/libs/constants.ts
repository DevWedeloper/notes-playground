import * as HttpStatusPhrases from 'stoker/http-status-phrases';
import { createMessageObjectSchema } from 'stoker/openapi/schemas';
import z from 'zod';
import { AnyErrorObject } from './types/zod';

export const ZOD_ERROR_MESSAGES = {
  REQUIRED: "Required",
  EXPECTED_NUMBER: "Invalid input: expected number, received NaN",
  NO_UPDATES: "No updates provided",
  EXPECTED_STRING: "Invalid input: expected string, received undefined",
};

export const ZOD_ERROR_CODES = {
  INVALID_UPDATES: "invalid_updates",
};

export const notFoundSchema = createMessageObjectSchema(HttpStatusPhrases.NOT_FOUND);

export const createCustomErrorSchema = <
  T extends AnyErrorObject
>(example: T) => {
  return z.object({
    success: z.literal(false),
    error: z.object({
      issues: z.array(
        z.object({
          code: z.literal(example.error.issues[0].code),
          path: z.array(z.union([z.string(), z.number()])),
          message: z.literal(example.error.issues[0].message),
        })
      ),
      name: z.literal("ZodError"),
    }),
  });
};

type CustomErrorSchema = z.infer<ReturnType<typeof createCustomErrorSchema>>;

export const noUpdatesError: CustomErrorSchema = {
  success: false,
  error: {
    issues: [
      {
        code: ZOD_ERROR_CODES.INVALID_UPDATES,
        path: [],
        message: ZOD_ERROR_MESSAGES.NO_UPDATES,
      },
    ],
    name: "ZodError",
  },
}
