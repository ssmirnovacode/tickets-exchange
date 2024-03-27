import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subjects";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated; // we add readonly so TS knows we won't change the value
  queueGroupName = "payments-service";
  onMessage(data: TicketCreatedEvent["data"], msg: Message): void {
    console.log("event data", data);

    msg.ack();
  }
}
