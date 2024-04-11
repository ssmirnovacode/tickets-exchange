import { Listener, OrderCancelledEvent, Subjects } from "@ticketsx/common";
import { queueGroupName } from "./constants";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticker-updated.publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    // find the ticket thats being reserved
    const ticket = await Ticket.findById(data.ticketId);

    if (!ticket) {
      throw new Error("Ticket does not exist");
    }

    ticket.set({ orderId: undefined });
    await ticket.save();

    // protected client property available from parent class
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
    });

    msg.ack();
  }
}
