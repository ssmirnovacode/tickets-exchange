import { TicketCreatedEvent } from "@ticketsx/common";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = () => {
  // create an instance of listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // create fake data
  const data: TicketCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert1",
    price: 150,
    version: 0,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create fake message object

  const message = {
    ack: jest.fn(),
  };

  return { listener, data, message };
};
describe("ticket-created-listener", () => {
  it("creates and saves a ticket", async () => {
    const { listener, data, message } = await setup();

    // @ts-ignore
    await listener.onMessage(data, message);

    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
  });

  it("acks the message", async () => {
    const { listener, data, message } = await setup();

    // @ts-ignore
    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
  });
});
