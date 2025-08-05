import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { z } from "zod";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { channels } from "../broker/channels/index.ts";
import { db } from "../db/client.ts";
import { randomUUID } from "node:crypto";
import { schema } from "../db/schema/index.ts";
import { dispatchOrderCreated } from "../broker/messages/order-created.ts";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

// Escalonamento horizontal
// Verificar se o serviço está rodando, funcionando, ver o tempo de resposta, etc.
app.get("/health", () => {
  return "OK";
});

app.register(fastifyCors, { origin: "*" });

app.post("/orders", {
    schema: {
      body: z.object({
        amount: z.coerce.number(),
      }),
    },
  },
  async (request, reply) => {
    const { amount } = request.body as { amount: number };

    console.log(`Creating an order with amount: ${amount}`);

    const orderId = randomUUID();

    dispatchOrderCreated({
      orderId,
      amount,
      customer: {
        id: "ae2c586e-5a6c-45a0-bc35-72194073be36",
      },
    });

    await db.insert(schema.orders).values({
      id: orderId,
      customerId: "ae2c586e-5a6c-45a0-bc35-72194073be36",
      amount,
    });
    return reply.status(201).send();
  }
);

app.listen({ host: "0.0.0.0", port: 3333 }, (err, address) => {
  console.log(`[Orders] HTTP Server running!`);
});
