import { Listener, Subjects, TicketUpdatedEvent } from '@nkgittix/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;
  async onMessage(
    data: TicketUpdatedEvent['data'],
    msg: Message
  ): Promise<void> {
    const { id, title, price } = data;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      throw new Error('Ticked not found');
    }

    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
