import { Publisher, Subjects, TicketUpdatedEvent } from "@ticketsx/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
