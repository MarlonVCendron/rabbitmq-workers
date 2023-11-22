import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { publishToQueue } from './messaging/rabbitmq';
import { OrderData } from './types';
import { query } from './database';

const router = Router();

router.post('/order', async (req, res) => {
  try {
    const { price, tax } = req.body;
    const orderData: OrderData = {
      id: uuidv4(),
      price,
      tax
    };

    await publishToQueue(orderData);
    res.send({ id: orderData.id });
  } catch (error) {
    console.error('Error in POST /order:', error);
    res.status(500).send('Error processing request');
  }
});

router.get('/order/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const result = await query('SELECT id, finalprice AS "finalPrice", taxvalue AS "taxValue" FROM orders WHERE id = $1', [id]);

    if (result.rows.length > 0) {
      res.send(result.rows[0]);
    } else {
      res.status(404).send('Order not found');
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
