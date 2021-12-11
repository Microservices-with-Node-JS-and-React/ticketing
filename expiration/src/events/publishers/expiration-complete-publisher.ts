import { ExpirationCompleteEvent, Publisher, Subjects } from '@nkgittix/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
