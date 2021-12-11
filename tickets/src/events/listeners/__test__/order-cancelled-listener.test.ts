import { OrderCancelledEvent, OrderStatus } from '@nkgittix/common';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-listener';
import mongoose from 'mongoose';

const setup = async () => {
  // create the listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = new mongoose.Types.ObjectId().toHexString();
  // create/save a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    userId: 'some-id',
  });

  ticket.set({ orderId });
  await ticket.save();

  // mock data event
  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // mock msg
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg, orderId };
};

// Note: condense into one test
it('should cancels the order correctly', async () => {
  // ticket should be reserved, and orderId should be assign
  const { msg, data, ticket, orderId, listener } = await setup();

  // cancels the order
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
