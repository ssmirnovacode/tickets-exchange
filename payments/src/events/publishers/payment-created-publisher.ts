//@ts-ignore
import { PaymentCreatedEvent, Publisher, Subjects } from "@ticketsx/common";

//@ts-ignore
export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  //@ts-ignore
  readonly subject = "payment:created"; // Subjects.PaymentCreated;
}
