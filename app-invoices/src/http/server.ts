import '../broker/subscriber.ts'

import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { z } from "zod";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

// Escalonamento horizontal
// Verificar se o serviço está rodando, funcionando, ver o tempo de resposta, etc.
app.get("/health", () => {
  return "OK";
});

app.register(fastifyCors, { origin: "*" });


app.listen({ host: "0.0.0.0", port: 3334 }, (err, address) => {
  console.log(`[Invoices] HTTP Server running!`);
});
