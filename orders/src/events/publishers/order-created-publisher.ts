import { OrderCreatedEvent, Publisher, Subjects } from '@nkgittix/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
