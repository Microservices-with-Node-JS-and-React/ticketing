import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Order } from '../../models/order';
import { OrderStatus } from '@nkgittix/common';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';

jest.mock('../../stripe');

const testToken = 'tok_visa';
it('should return a 404 when charging a non-existent order', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', signin())
    .send({
      token: testToken,
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it('should return a 401 when order is not user`s one', async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', signin())
    .send({
      token: testToken,
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it('should return a 400 when the order is cancelled', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', signin(userId))
    .send({
      token: testToken,
      orderId: order.id,
    })
    .expect(400);
});

it('should return a 201 when inputs are valid', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', signin(userId))
    .send({
      token: testToken,
      orderId: order.id,
    })
    .expect(201);

  expect(stripe.charges.create).toHaveBeenCalledWith({
    currency: 'usd',
    amount: order.price * 100,
    source: testToken,
  });

  // verify payment is created
  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: '1234',
  });

  expect(payment).not.toBeNull();
});
