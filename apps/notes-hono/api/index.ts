import { handle } from "@hono/node-server/vercel";

import app from "../dist/apps/notes-hono/src/app.js";

export default handle(app);
