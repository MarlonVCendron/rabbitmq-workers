import express from "express";
import router from './routes';
import { initializeRabbitMQ } from './messaging/rabbitmq';

const app = express();
const port = 3000;


app.use(express.json());

initializeRabbitMQ();

app.use(router);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
