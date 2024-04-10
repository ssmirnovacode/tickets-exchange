import { OrderCreatedEvent, OrderStatus } from "@ticketsx/common";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: "concert",
    price: 99,
    userId: "whatever",
  });

  await ticket.save();

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: "smth",
    expiresAt: "12/12/3000",
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  const message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, message };
};

describe("order-created-listener", () => {
  it("sets the orderId of the ticket", async () => {
    const { listener, ticket, data, message } = await setup();

    //@ts-ignore
    await listener.onMessage(data, message);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toEqual(data.id);
  });

  it("calls ack() on message", async () => {
    const { listener, data, message } = await setup();

    //@ts-ignore
    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
  });

  it("publishes a ticket:updated event", async () => {
    const { listener, ticket, data, message } = await setup();

    //@ts-ignore
    await listener.onMessage(data, message);

    expect(natsWrapper.client.publish).toHaveBeenCalled(); // natswrapper.client will call this.client of listener

    const ticketUpdatedData = JSON.parse(
      (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    );

    expect(data.id).toEqual(ticketUpdatedData.orderId);
  });
});
