import { ExpirationCompleteEvent, OrderStatus } from "@ticketsx/common";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import mongoose from "mongoose";
import { Order } from "../../../models/order";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "some concert",
    price: 99,
  });
  await ticket.save();

  const order = Order.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  const message = { ack: jest.fn() };

  return { listener, data, message, order };
};

describe("expiration-complete-listener", () => {
  it("cancels the order", async () => {
    const { listener, data, message } = await setup();
    //@ts-ignore
    await listener.onMessage(data, message);

    const updatedOrder = await Order.findById(data.orderId);

    expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
  });

  it("publishes the order:cancelled event", async () => {
    const { listener, data, message, order } = await setup();
    //@ts-ignore
    await listener.onMessage(data, message);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
    const eventData = JSON.parse(
      (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    );
    expect(eventData.id).toEqual(order.id);
  });

  it("acks the message", async () => {
    const { listener, data, message } = await setup();
    //@ts-ignore
    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
  });

  it("does not ack if smth fails", async () => {
    const { listener, message } = await setup();
    try {
      //@ts-ignore
      await listener.onMessage({ orderId: "wrong" }, message);
    } catch (err) {}

    expect(message.ack).not.toHaveBeenCalled();
  });
});
