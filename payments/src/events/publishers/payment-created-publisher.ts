import { PaymentCreatedEvent, Publisher, Subjects } from '@nkgittix/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
