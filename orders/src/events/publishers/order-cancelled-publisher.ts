import { OrderCancelledEvent, Publisher, Subjects } from "@ticketsx/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
