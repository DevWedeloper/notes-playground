import type { NotFoundHandler } from 'hono';
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";


const notFound: NotFoundHandler = (c) =>
  c.json(
    {
      message: `${HttpStatusPhrases.NOT_FOUND} - ${c.req.path}`,
    },
    HttpStatusCodes.NOT_FOUND,
  );

export default notFound;
