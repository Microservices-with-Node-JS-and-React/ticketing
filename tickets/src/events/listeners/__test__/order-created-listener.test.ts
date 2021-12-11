import { OrderCreatedEvent, OrderStatus } from '@nkgittix/common';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  // create the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // create/save a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    userId: 'some-id',
  });

  await ticket.save();

  // mock data event
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'some-user-id',
    expiresAt: 'asdasd',
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // mock msg
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it('should set the orderId of the ticket', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg); // now the ticket from the setup
  // is outdated, because we updated it in the OnMessage

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it('should acks the message', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('should publish a ticket updated event', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  // verify correct orderId is assigned
  const orderId = data.id;
  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(ticketUpdatedData.orderId).toEqual(orderId);
});
