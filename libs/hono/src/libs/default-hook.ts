import type { Hook } from '@hono/zod-openapi';
import * as HttpStatusCodes from "stoker/http-status-codes";

const defaultHook: Hook<any, any, any, any> = (result, c) => {
  if (result.success === false) {
    return c.json(
      {
        success: result.success,
        error: {
          name: result.error.name,
          issues: result.error.issues,
        },
      },
      HttpStatusCodes.UNPROCESSABLE_ENTITY,
    );
  }
  
  return undefined;
};

export default defaultHook;
