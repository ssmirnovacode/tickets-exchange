import { OrderCancelledEvent, OrderStatus } from "@ticketsx/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";
import mongoose from "mongoose";
import { Order } from "../../../models/order";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: "smth",
    version: 0,
    status: OrderStatus.Created,
    price: 15,
  });
  await order.save();

  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    version: 1,
    ticketId: new mongoose.Types.ObjectId().toHexString(),
  };

  const message = { ack: jest.fn() };

  return { listener, data, message, order };
};

describe("order-cancelled-listener", () => {
  it("updates the order with status: cancelled", async () => {
    const { listener, data, message, order } = await setup();

    //@ts-ignore
    await listener.onMessage(data, message);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
  });

  it("acks the message", async () => {
    const { listener, data, message } = await setup();

    //@ts-ignore
    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
  });

  it("does not ack if order not found", async () => {
    const { listener, message } = await setup();

    try {
      //@ts-ignore
      await listener.onMessage({ orderId: "wrong" }, message);
    } catch (err) {}

    expect(message.ack).not.toHaveBeenCalled();
  });
});
