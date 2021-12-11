import { Listener, OrderCancelledEvent, Subjects } from '@nkgittix/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';
import { queueGroupName } from './queue-group-name';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;
  async onMessage(
    data: OrderCancelledEvent['data'],
    msg: Message
  ): Promise<void> {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.set({ orderId: undefined });
    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      orderId: ticket.orderId,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    msg.ack();
  }
}
