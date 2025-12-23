import { Upload } from "@aws-sdk/lib-storage";
import { stringify } from "csv-stringify";
import { desc } from "drizzle-orm";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { randomUUID } from "node:crypto";
import { PassThrough, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { client, db } from "../db/connection";
import { links } from "../db/schema";
import { r2 } from "../storage/r2";

export async function exportCsv(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post("/export/csv", async (request, reply) => {
    try {
      // Generate SQL query using Drizzle
      const { sql, params } = db
        .select({
          id: links.id,
          originalUrl: links.originalUrl,
          shortCode: links.shortCode,
          views: links.views,
          createdAt: links.createdAt,
        })
        .from(links)
        .orderBy(desc(links.createdAt))
        .toSQL();

      // Initialize raw cursor for streaming (batch size: 10)
      const cursor = client.unsafe(sql, params as any[]).cursor(10);

      // Configure CSV stringifier
      const csv = stringify({
        delimiter: ",",
        header: true,
        columns: [
          { key: "id", header: "ID" },
          { key: "originalUrl", header: "Original URL" },
          { key: "shortUrl", header: "Shortened URL" },
          { key: "views", header: "Views" },
          { key: "createdAt", header: "Created At" },
        ],
      });

      // Transform stream: flatten chunks and format rows
      const transformStream = new Transform({
        objectMode: true,
        transform(chunks: any[], encoding, callback) {
          for (const chunk of chunks) {
            const enrichedChunk = {
              id: chunk.id,
              originalUrl: chunk.original_url,
              shortUrl: `${process.env.BASE_URL}/${chunk.short_code}`,
              views: chunk.views,
              createdAt: new Date(chunk.created_at).toISOString(),
            };
            this.push(enrichedChunk);
          }
          callback();
        },
      });

      // Bridge stream for upload
      const uploadToStorageStream = new PassThrough();

      // Connect streams pipeline
      const convertToCSVPipeline = pipeline(cursor, transformStream, csv, uploadToStorageStream);

      // Start multipart upload to Cloudflare R2
      const fileName = `${randomUUID()}.csv`;

      const uploadToStorage = new Upload({
        client: r2,
        params: {
          Bucket: process.env.CLOUDFLARE_BUCKET,
          Key: fileName,
          Body: uploadToStorageStream,
          ContentType: "text/csv",
          ContentDisposition: `attachment; filename="links-export-${fileName}"`,
        },
      }).done();

      // Wait for both processing and upload to complete
      await Promise.all([uploadToStorage, convertToCSVPipeline]);

      const downloadUrl = `${process.env.CLOUDFLARE_PUBLIC_URL}/${fileName}`;

      return reply.send({ downloadUrl });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Failed to export CSV" });
    }
  });
}
