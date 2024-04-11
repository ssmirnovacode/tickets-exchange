import { OrderCancelledEvent, OrderStatus } from "@ticketsx/common";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";
import mongoose from "mongoose";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: "concert",
    price: 99,
    userId: "whatever",
  });
  ticket.set({ orderId });

  await ticket.save();

  const data: OrderCancelledEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    ticketId: ticket.id,
  };

  const message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, message, orderId };
};
describe("order cancelled listener", () => {
  it("removed orderId from ticket from cancelled order", async () => {
    const { listener, ticket, data, message, orderId } = await setup();
    // @ts-ignore
    await listener.onMessage(data, message);

    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.orderId).toBeUndefined();
  });

  it("publishes an event", async () => {
    const { listener, ticket, data, message, orderId } = await setup();
    // @ts-ignore
    await listener.onMessage(data, message);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });

  it("acks the update", async () => {
    const { listener, ticket, data, message, orderId } = await setup();
    // @ts-ignore
    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
  });
});
