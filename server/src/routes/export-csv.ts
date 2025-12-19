import { PutObjectCommand } from "@aws-sdk/client-s3";
import { stringify } from "csv-stringify/sync";
import { desc } from "drizzle-orm";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { db } from "../db/connection";
import { links } from "../db/schema";
import { r2 } from "../storage/r2";

export async function exportCsv(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post("/export/csv", async (request, reply) => {
    // Fetch data
    const allLinks = await db.select().from(links).orderBy(desc(links.createdAt));

    // Generate CSV
    const csvData = stringify(
      allLinks.map((link) => [link.originalUrl, `${process.env.BASE_URL}/${link.shortCode}`, link.views, link.createdAt.toISOString()]),
      {
        header: true,
        columns: ["Original URL", "Shortened URL", "Views", "Created at"],
      }
    );

    // Upload to Cloudflare R2
    const fileName = `${new Date().toISOString}-links.csv`;

    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.CLOUDFLARE_BUCKET,
        Key: fileName,
        Body: csvData,
        ContentType: "text/csv",
      })
    );

    const downloadUrl = `${process.env.CLOUDFLARE_PUBLIC_URL}/${fileName}`;

    return reply.send({ downloadUrl });
  });
}
