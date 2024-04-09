import { Listener, Subjects, TicketUpdatedEvent } from "@ticketsx/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./constants";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(
    data: TicketUpdatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const { title, price } = data;
    const ticket = await Ticket.findByEvent(data);
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    ticket.set({ title, price });
    await ticket.save();
    // version will be automatically incremented by plugin

    msg.ack();
  }
}
