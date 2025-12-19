import { eq } from "drizzle-orm";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "../db/connection";
import { links } from "../db/schema";
import { encode } from "../lib/base62";

export async function createLink(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/links",
    {
      schema: {
        body: z.object({
          originalUrl: z.url(),
        }),
      },
    },
    async (request, reply) => {
      const { originalUrl } = request.body;

      // Checks if the URL already exists in the database.
      const existingLink = await db.select().from(links).where(eq(links.originalUrl, originalUrl)).limit(1);

      if (existingLink.length > 0) {
        return reply.status(200).send({ shortCode: existingLink[0].shortCode, originalUrl });
      }

      // Enter the original URL to obtain a unique ID, in case it's a new link.
      const [newLink] = await db
        .insert(links)
        .values({
          originalUrl,
        })
        .returning({ id: links.id });

      // Convert the generated numeric ID to Base62 (with Offset)
      const code = encode(newLink.id);

      // Update the record with the generated code.
      await db.update(links).set({ shortCode: code }).where(eq(links.id, newLink.id));

      return reply.status(201).send({ shortCode: code, originalUrl });
    }
  );
}
