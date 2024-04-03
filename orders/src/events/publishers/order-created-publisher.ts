import { OrderCreatedEvent, Publisher, Subjects } from "@ticketsx/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
