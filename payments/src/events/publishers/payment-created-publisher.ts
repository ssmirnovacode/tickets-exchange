import { PaymentCreatedEvent, Publisher, Subjects } from "@ticketsx/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
