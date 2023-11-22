import amqp, { Channel, Connection } from "amqplib";
import { ordersQueue, rabbitMqUrl } from "../consts";
import { OrderData } from "../types";

let channel: Channel;
let connection: Connection;

export const initializeRabbitMQ = async () => {
  try {
    connection = await amqp.connect(rabbitMqUrl);
    channel = await connection.createChannel();

    await channel.assertQueue(ordersQueue, { durable: true });
  } catch (error) {
    console.error("Error initializing RabbitMQ:", error);
  }
};

export const publishToQueue = async (data: OrderData) => {
  try {
    const stringifiedData = JSON.stringify(data);
    channel.sendToQueue(ordersQueue, Buffer.from(stringifiedData), {
      persistent: true,
    });
    console.log(` [x] Sent '${stringifiedData}'`);
  } catch (error) {
    console.error("Error in publishing to RabbitMQ:", error);
  }
};

process.on("SIGINT", async () => {
  await channel.close();
  await connection.close();
  process.exit(0);
});
