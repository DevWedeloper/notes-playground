import { workspaceRoot } from '@nx/devkit';
import { config } from 'dotenv';
import * as path from 'path';
import z from 'zod';

config({ path: path.resolve(workspaceRoot, '.env') });

const envSchema = z
  .object({
    NODE_ENV: z.string().default('development'),
    DATABASE_URL: z.string().url(),
    DATABASE_AUTH_TOKEN: z.string().optional(),
  })
  .superRefine((input, ctx) => {
    if (input.NODE_ENV === 'production' && !input.DATABASE_AUTH_TOKEN) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_type,
        expected: 'string',
        received: 'undefined',
        path: ['DATABASE_AUTH_TOKEN'],
        message: "Must be set when NODE_ENV is 'production'",
      });
    }
  });

const { data: env, error } = envSchema.safeParse(process.env);

if (error) {
  console.error('❌ Invalid env:');
  console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
  process.exit(1);
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export default env!;
