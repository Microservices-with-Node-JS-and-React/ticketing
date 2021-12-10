import { Listener, Subjects, TicketCreatedEvent } from '@nkgittix/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;
  async onMessage(
    data: TicketCreatedEvent['data'],
    msg: Message
  ): Promise<void> {
    const { id, title, price } = data;

    // Note: On data replication use identical/consistent Ids
    // for same objects between services
    const ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save();

    msg.ack();
  }
}
