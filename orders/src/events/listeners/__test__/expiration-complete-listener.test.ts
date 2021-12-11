import {
  ExpirationCompleteEvent,
  OrderCancelledEvent,
  OrderStatus,
} from '@nkgittix/common';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { ExpirationCompleteListener } from '../expiration-complete-listener';
import mongoose from 'mongoose';
import { Order } from '../../../models/orders';
export { Message } from 'node-nats-streaming';

const setup = async () => {
  // create a Listener
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  // create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });

  await ticket.save();

  // create and save an order
  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'asdas',
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  // data mock
  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  };

  // message mock
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, ticket, data, msg };
};

it('should update the order`s status to cancelled ', async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('should call #publish from OrderCancelledPublisher', async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const orderEventData: OrderCancelledEvent['data'] = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(orderEventData.id).toEqual(order.id);
});

it('should acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
