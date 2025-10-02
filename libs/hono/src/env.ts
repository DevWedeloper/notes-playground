import { workspaceRoot } from '@nx/devkit';
import { config } from 'dotenv';
import path from 'path';
import z from 'zod';

config({
  path: path.resolve(
    workspaceRoot,
    process.env.NODE_ENV === "test" ? ".env.test" : ".env"
  )
});

const envSchema = z.object({
  NODE_ENV: z.string().default('development'),
  LOG_LEVEL: z.enum([
    'fatal',
    'error',
    'warn',
    'info',
    'debug',
    'trace',
    'silent',
  ]),
});

const { data: env, error } = envSchema.safeParse(process.env);

if (error) {
  console.error('❌ Invalid env:');
  console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
  process.exit(1);
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export default env!;
