import mongoose from "mongoose";
import request from "supertest";
import { baseUrl } from "../../constants";
import { app } from "../../app";
import { createTicketAndOrder } from "./helpers";
import { OrderStatus } from "@ticketsx/common";

describe("cancel order", () => {
  it("returns 404 if order is not found", async () => {
    const orderId = new mongoose.Types.ObjectId();

    await request(app)
      .delete(`${baseUrl}/${orderId}`)
      .set("Cookie", global.signin())
      .send()
      .expect(404);
  });

  it("returns 401 if order does not belong to current user", async () => {
    const { order, user } = await createTicketAndOrder();
    await request(app)
      .delete(`${baseUrl}/${order.id}`)
      .set("Cookie", global.signin())
      .send()
      .expect(401);
  });

  it("deletes the order", async () => {
    const { order, user } = await createTicketAndOrder();
    await request(app)
      .delete(`${baseUrl}/${order.id}`)
      .set("Cookie", user)
      .send()
      .expect(204);

    const { body: fetchedOrder } = await request(app)
      .get(`${baseUrl}/${order.id}`)
      .set("Cookie", user)
      .send()
      .expect(200);

    expect(fetchedOrder.status).toEqual(OrderStatus.Cancelled);
  });

  it.todo("emits order:cancelled event");
});
