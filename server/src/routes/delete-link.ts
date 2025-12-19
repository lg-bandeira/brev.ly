import { eq } from "drizzle-orm";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "../db/connection";
import { links } from "../db/schema";

export async function deleteLink(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/links/:shortCode",
    {
      schema: {
        params: z.object({
          shortCode: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { shortCode } = request.params;

      await db.delete(links).where(eq(links.shortCode, shortCode));

      return reply.status(204).send();
    }
  );
}
