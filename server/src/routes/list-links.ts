import { desc } from "drizzle-orm";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "../db/connection";
import { links } from "../db/schema";

export async function listLinks(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/links",
    {
      schema: {
        querystring: z.object({
          page: z.coerce.number().min(1).default(1),
          limit: z.coerce.number().min(1).max(100).default(50),
        }),
      },
    },
    async (request) => {
      const { page, limit } = request.query;

      const offset = (page - 1) * limit;

      return await db.select().from(links).orderBy(desc(links.createdAt)).limit(limit).offset(offset);
    }
  );
}
