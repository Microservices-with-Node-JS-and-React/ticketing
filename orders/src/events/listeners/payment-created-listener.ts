import {
  Listener,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
} from '@nkgittix/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/orders';
import { queueGroupName } from './queue-group-name';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;
  async onMessage(
    data: PaymentCreatedEvent['data'],
    msg: Message
  ): Promise<void> {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({
      status: OrderStatus.Complete,
    });
    await order.save();

    // Note: if we have a functionality for an order to be further updated,
    // we should emit an event that a version has changed
    // but in this scenario, once and Order is completed we forget about it, so no need.

    msg.ack();
  }
}
