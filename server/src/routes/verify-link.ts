import { eq } from "drizzle-orm";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "../db/connection";
import { links } from "../db/schema";

export async function verifyLink(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/verify/:shortCode",
    {
      schema: {
        params: z.object({
          shortCode: z.string().length(5, { message: "The code must be 5 characters long." }),
        }),
      },
    },
    async (request, reply) => {
      const { shortCode } = request.params;

      const result = await db.select({ id: links.id }).from(links).where(eq(links.shortCode, shortCode));

      const link = result[0];

      if (!link) {
        return reply.status(404).send({ message: "Link not found" });
      }

      return reply.status(200).send({ valid: true });
    }
  );
}
