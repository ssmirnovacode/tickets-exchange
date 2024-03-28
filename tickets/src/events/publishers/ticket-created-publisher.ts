import { Publisher, Subjects, TicketCreatedEvent } from "@ticketsx/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
