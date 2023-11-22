import axios from 'axios';
import { faker } from '@faker-js/faker';

const sendRequest = async (requestNumber: number) => {
  const startTime = `Request ${requestNumber}`;
  console.time(startTime);

  try {
    const price = parseFloat(faker.commerce.price());
    const tax = Math.random() * 0.2;

    const response = await axios.post('http://localhost:3000/order', { price, tax });
    console.timeEnd(startTime);
    console.log(`Order ID for request ${requestNumber}:`, response.data.id);
  } catch (error) {
    console.timeEnd(startTime);
    console.error(`Error in sending request ${requestNumber}:`, error);
  }
};

const runLoadTest = async () => {
  const promises = [];
  console.time('Total time for all requests');

  for (let i = 0; i < 1000; i++) {
    promises.push(sendRequest(i));
  }

  await Promise.all(promises);
  console.timeEnd('Total time for all requests');
};

runLoadTest();
