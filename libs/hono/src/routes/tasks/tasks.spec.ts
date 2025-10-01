import db from '@/core/db';
import * as schema from '@/core/db/schema';
import { create } from '@/core/use-cases/task';
import { execSync } from 'child_process';
import { sql } from 'drizzle-orm';
import { reset } from "drizzle-seed";
import { testClient } from 'hono/testing';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';
import { describe, expectTypeOf, it } from 'vitest';
import { ZodIssueCode } from 'zod';
import env from '../../env';
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from '../../libs/constants';
import { createTestApp } from '../../libs/create-app';
import router from './index';

if (env.NODE_ENV !== 'test') {
  throw new Error('NODE_ENV must be \'test\'');
}

const client = testClient(createTestApp(router));

async function createTestTask(overrides: Partial<any> = {}) {
  return await create({
    name: "test",
    done: false,
    ...overrides,
  });
}

describe('tasks routes', () => {
  beforeAll(async () => {
    execSync('npx drizzle-kit push --force --config ./libs/core/drizzle.config.ts');
    await reset(db, schema);
    await db.run(sql`DELETE FROM sqlite_sequence;`);
  });

  afterAll(async () => {
    await reset(db, schema);
    await db.run(sql`DELETE FROM sqlite_sequence;`);
  });

  describe('GET', () => {
    it('/tasks lists all tasks', async () => {
      const response = await client.tasks.$get();

      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expectTypeOf(json).toBeArray();
      }
    });
  });

  describe('POST', () => {
    it('/tasks validates the body when creating', async () => {
      const response = await client.tasks.$post({
        json: {
          done: false,
        },
      });

      expect(response.status).toBe(422);
      if (response.status === 422) {
        const json = await response.json();
        expect(json.error.issues[0].path[0]).toBe("name");
        expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.EXPECTED_STRING);
      }
    })

    it("/tasks creates a task", async () => {
      const name = "test";

      const response = await client.tasks.$post({
        json: {
          name,
          done: false,
        },
      });

      expect(response.status).toBe(201);
      if (response.status === 201) {
        const json = await response.json();
        expect(json.name).toBe(name);
        expect(json.done).toBe(false);
      }
    });
  });

  describe('PATCH', () => {
    it("/tasks/{id} validates the body when updating", async () => {
      const { id } = await createTestTask();

      const response = await client.tasks[":id"].$patch({
        param: {
          id,
        },
        json: {
          name: "",
        },
      });

      expect(response.status).toBe(422);
      if (response.status === 422) {
        const json = await response.json();
        expect(json.error.issues[0].path[0]).toBe("name");
        expect(json.error.issues[0].code).toBe(ZodIssueCode.too_small);
      }
    });

    it("/tasks/{id} validates the id param", async () => {
      const response = await client.tasks[":id"].$patch({
        param: {
          id: "wat",
        },
        json: {},
      });

      expect(response.status).toBe(422);
      if (response.status === 422) {
        const json = await response.json();
        expect(json.error.issues[0].path[0]).toBe("id");
        expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.EXPECTED_NUMBER);
      }
    });

    it("/tasks/{id} validates empty body", async () => {
      const { id } = await createTestTask();

      const response = await client.tasks[":id"].$patch({
        param: {
          id,
        },
        json: {},
      });

      expect(response.status).toBe(422);
      if (response.status === 422) {
        const json = await response.json();
        expect(json.error.issues[0].code).toBe(ZOD_ERROR_CODES.INVALID_UPDATES);
        expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.NO_UPDATES);
      }
    });

    it("/tasks/{id} returns 404 when task not found", async () => {
      const response = await client.tasks[":id"].$patch({
        param: {
          id: 999,
        },
        json: {
          name: "test",
        },
      });

      expect(response.status).toBe(404);
      if (response.status === 404) {
        const json = await response.json();
        expect(json.message).toBe(HttpStatusPhrases.NOT_FOUND);
      }
    });

    it("/tasks/{id} updates a single property of a task", async () => {
      const { id } = await createTestTask();

      const response = await client.tasks[":id"].$patch({
        param: {
          id,
        },
        json: {
          done: true,
        },
      });

      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(json.done).toBe(true);
      }
    });
  })

  describe('DELETE', () => {
    it("/tasks/{id} validates the id when deleting", async () => {
      const response = await client.tasks[":id"].$delete({
        param: {
          id: "wat",
        },
      });

      expect(response.status).toBe(422);
      if (response.status === 422) {
        const json = await response.json();
        expect(json.error.issues[0].path[0]).toBe("id");
        expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.EXPECTED_NUMBER);
      }
    });

    it("/tasks/{id} returns 404 when task not found", async () => {
      const response = await client.tasks[":id"].$delete({
        param: {
          id: 999,
        }
      });

      expect(response.status).toBe(404);
      if (response.status === 404) {
        const json = await response.json();
        expect(json.message).toBe(HttpStatusPhrases.NOT_FOUND);
      }
    });

    it("/tasks/{id} removes a task", async () => {
      const { id } = await createTestTask();

      const response = await client.tasks[":id"].$delete({
        param: {
          id,
        },
      });

      expect(response.status).toBe(204);
    });
  });
});
