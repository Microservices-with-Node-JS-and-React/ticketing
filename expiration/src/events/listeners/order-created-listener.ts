import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from '@nkgittix/common';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expiration-queue';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(
    data: OrderCreatedEvent['data'],
    msg: Message
  ): Promise<void> {
    const payload = {
      orderId: data.id,
    };

    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log(`Waiting ${delay} milliseconds to proccess the job`);
    await expirationQueue.add(payload, {
      delay,
    });

    msg.ack();
  }
}
