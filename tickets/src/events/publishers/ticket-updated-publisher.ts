import { Publisher, Subjects, TicketUpdatedEvent } from '@nkgittix/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
