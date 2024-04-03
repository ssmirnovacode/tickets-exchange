import mongoose from "mongoose";
import request from "supertest";
import { baseUrl } from "../../constants";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order } from "../../models/order";
import { OrderStatus } from "@ticketsx/common";
import { natsWrapper } from "../../nats-wrapper";

describe("create order", () => {
  it("returns 401 if not authenticated", async () => {
    const ticketId = new mongoose.Types.ObjectId();

    await request(app).post(baseUrl).send({ ticketId }).expect(401);
  });

  it("returns 400 if passed invalid params", async () => {
    await request(app)
      .post(baseUrl)
      .set("Cookie", global.signin())
      .send({})
      .expect(400);
  });

  it("returns an error if the ticket does not exist", async () => {
    const ticketId = new mongoose.Types.ObjectId();

    await request(app)
      .post(baseUrl)
      .set("Cookie", global.signin())
      .send({ ticketId })
      .expect(404);
  });

  it("returns an error if the ticket is already reserved", async () => {
    const ticket = Ticket.build({
      title: "concert",
      price: 23,
    });
    await ticket.save();

    const order = Order.build({
      ticket,
      userId: "abc",
      status: OrderStatus.Created,
      expiresAt: new Date(),
    });
    await order.save();

    await request(app)
      .post(baseUrl)
      .set("Cookie", global.signin())
      .send({ ticketId: ticket.id })
      .expect(400);
  });

  it("reserves the ticket", async () => {
    const ticket = Ticket.build({
      title: "concert",
      price: 25,
    });
    await ticket.save();

    const response = await request(app)
      .post(baseUrl)
      .set("Cookie", global.signin())
      .send({ ticketId: ticket.id })
      .expect(201);

    expect(response.body.ticket.id).toEqual(ticket.id);
  });

  it("emits an order:created event", async () => {
    const ticket = Ticket.build({
      title: "concert",
      price: 25,
    });
    await ticket.save();

    const response = await request(app)
      .post(baseUrl)
      .set("Cookie", global.signin())
      .send({ ticketId: ticket.id })
      .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
