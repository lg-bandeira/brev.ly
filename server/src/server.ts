import cors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import scalarUI from "@scalar/fastify-api-reference";
import fastify from "fastify";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import { createLink } from "./routes/create-link";
import { deleteLink } from "./routes/delete-link";
import { exportCsv } from "./routes/export-csv";
import { getLink } from "./routes/get-link";
import { listLinks } from "./routes/list-links";

// Setup Fastify + Zod server
const app = fastify().withTypeProvider<ZodTypeProvider>();

// Add Zod schema validator and serializer
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Setup plugins
app.register(cors, { origin: "*" });
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Brev.ly API",
      description: "Brev.ly API documentation",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});
app.register(scalarUI, {
  routePrefix: "/docs",
});

// Register routes
app.register(createLink);
app.register(getLink);
app.register(listLinks);
app.register(deleteLink);
app.register(exportCsv);

// Start server
app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log("🚀 HTTP Server Running!");
});
