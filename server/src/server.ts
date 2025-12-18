import fastify from "fastify";
import cors from "@fastify/cors";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";

// Setup Fastify + Zod server
const app = fastify().withTypeProvider<ZodTypeProvider>();

// Add Zod schema validator and serializer
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Setup plugins
app.register(cors, { origin: "*" });

// Start server
app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log("🚀 HTTP Server Running!");
});
