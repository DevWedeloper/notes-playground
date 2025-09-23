import { handle } from "@hono/node-server/vercel";

import app from "../dist/index.js";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export default handle(app);
