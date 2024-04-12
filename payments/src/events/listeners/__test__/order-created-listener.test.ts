import { OrderCreatedEvent, OrderStatus } from "@ticketsx/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";
import { Order } from "../../../models/order";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: "whatever",
    userId: "smth",
    status: OrderStatus.Created,
    ticket: {
      id: "asdasd",
      price: 10,
    },
  };

  const message = {
    ack: jest.fn(),
  };

  return { listener, data, message };
};
describe("order-created-listener", () => {
  it("creates an order with replicted info", async () => {
    const { listener, data, message } = await setup();

    //@ts-ignore
    await listener.onMessage(data, message);

    const order = await Order.findById(data.id);

    expect(order!.price).toEqual(data.ticket.price);
  });

  it("acks the message", async () => {
    const { listener, data, message } = await setup();

    //@ts-ignore
    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
  });
});
