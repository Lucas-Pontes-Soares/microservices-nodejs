import '@opentelemetry/auto-instrumentations-node/register';

import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { trace } from '@opentelemetry/api';
import { z } from "zod";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { channels } from "../broker/channels/index.ts";
import { db } from "../db/client.ts";
import { randomUUID } from "node:crypto";
import { setTimeout } from "node:timers/promises";
import { schema } from "../db/schema/index.ts";
import { dispatchOrderCreated } from "../broker/messages/order-created.ts";
import { ca } from 'zod/v4/locales';
import { tracer } from '../tracer/tracer.ts';

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

    await db.insert(schema.orders).values({
      id: orderId,
      customerId: "ae2c586e-5a6c-45a0-bc35-72194073be36",
      amount,
    });

    const span = tracer.startSpan('eu acho que aqui ta dando merda');

    span.setAttribute('test', 'hello world')
    await setTimeout(2000) // simular um processamento demorado

    span.end();
    
    trace.getActiveSpan()?.setAttribute('order_id', orderId) // acessar a requisição atual, e adicionar atributos no trace

    dispatchOrderCreated({
      orderId,
      amount,
      customer: {
        id: "ae2c586e-5a6c-45a0-bc35-72194073be36",
      },
    });

    return reply.status(201).send();
  }
);

app.listen({ host: "0.0.0.0", port: 3333 }, (err, address) => {
  console.log(`[Orders] HTTP Server running!`);
});
