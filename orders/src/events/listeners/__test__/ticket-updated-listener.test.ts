import { TicketCreatedEvent, TicketUpdatedEvent } from "@ticketsx/common";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { TicketUpdatedListener } from "../ticket-updated-listener";

const setup = async () => {
  // create an instance of listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert1",
    price: 150,
  });
  await ticket.save();

  // create fake data
  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    title: "concert12",
    price: 199,
    version: ticket.version + 1,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create fake message object
  const message = {
    ack: jest.fn(),
  };

  return { listener, data, ticket, message };
};
describe("ticket-updated-listener", () => {
  it("finds, updates and saves a ticket", async () => {
    const { listener, data, message, ticket } = await setup();

    // @ts-ignore
    await listener.onMessage(data, message);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket).toBeDefined();
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
  });

  it("acks the message ", async () => {
    const { listener, data, message } = await setup();

    // @ts-ignore
    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
  });

  it("does not ack an event with wrong version", async () => {
    const { listener, data, message } = await setup();

    data.version = 123;
    try {
      // @ts-ignore
      await listener.onMessage(data, message);
    } catch (err) {}

    expect(message.ack).not.toHaveBeenCalled();
  });
});
