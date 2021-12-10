import { OrderCancelledEvent, Publisher, Subjects } from '@nkgittix/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
