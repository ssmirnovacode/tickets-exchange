import {
  Listener,
  OrderStatus,
  //@ts-ignore
  PaymentCreatedEvent,
  Subjects,
} from "@ticketsx/common";
import { queueGroupName } from "./constants";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

//@ts-ignore
export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  //@ts-ignore
  readonly subject = "payment:created"; // Subjects.PaymentCreated; // skaffold ts bug
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error("Order not found!");
    }

    order.set({ status: OrderStatus.Complete });
    await order.save();

    msg.ack();
  }
}
