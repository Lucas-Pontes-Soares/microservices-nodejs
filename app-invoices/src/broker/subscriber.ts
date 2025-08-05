// Publish/Subscribe pattern

import { orders } from "./channels/orders.ts";

orders.consume('orders', async message => {
    if(!message) {
        return null;
    }
    console.log(message?.content.toString());

    orders.ack(message);
}, {
    noAck: false, // Reconhecer, dizer que a mensagem foi recebida com sucesso, não fazer isso automaticamente
})