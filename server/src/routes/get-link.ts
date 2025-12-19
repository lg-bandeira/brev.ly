import { eq, sql } from "drizzle-orm";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "../db/connection";
import { links } from "../db/schema";

export async function getLink(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/:shortCode",
    {
      schema: {
        params: z.object({
          shortCode: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { shortCode } = request.params;

      // Optimized Search
      const result = await db.select().from(links).where(eq(links.shortCode, shortCode));
      const link = result[0];

      if (!link) {
        return reply.status(404).send({ message: "Link not found" });
      }

      // Atomic Increment
      await db
        .update(links)
        .set({ views: sql`${links.views} + 1` })
        .where(eq(links.id, link.id));

      return reply.redirect(link.originalUrl);
    }
  );
}
