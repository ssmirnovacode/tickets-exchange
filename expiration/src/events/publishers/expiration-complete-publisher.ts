import { ExpirationCompleteEvent, Publisher, Subjects } from "@ticketsx/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
