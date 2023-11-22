import amqp, { ConsumeMessage } from "amqplib";
import { ordersQueue, rabbitMqUrl } from "../consts";
import { OrderData } from "../types";
import { query } from "../database";

const workerIndex = process.env.WORKER_INDEX || '0';

const startWorker = async () => {
  try {
    const connection = await amqp.connect(rabbitMqUrl);
    const channel = await connection.createChannel();

    await channel.assertQueue(ordersQueue, { durable: true });

    console.log(`[*] Worker ${workerIndex} - Waiting for messages in ${ordersQueue}.`);

    channel.consume(
      ordersQueue,
      async (msg: ConsumeMessage | null) => {
        if (msg) {
          const orderData = JSON.parse(msg.content.toString()) as OrderData;

          const { id, price, tax } = orderData;
          const taxValue = price * tax;
          const finalPrice = price + taxValue;

          await query(
            "INSERT INTO orders (id, price, tax, finalprice, taxvalue) VALUES ($1, $2, $3, $4, $5)",
            [id, price, tax, finalPrice, taxValue]
          );

          console.log(` Worker ${workerIndex} - [x] Received ${msg.content.toString()}`);
          channel.ack(msg);
        }
      },
      {
        noAck: false,
      }
    );
  } catch (error) {
    console.error("Error in worker service:", error);
  }
};

startWorker();
