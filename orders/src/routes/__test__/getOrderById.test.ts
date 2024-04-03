import request from "supertest";
import { baseUrl } from "../../constants";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

async function createTicketAndOrder() {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const user = global.signin();

  const { body: order } = await request(app)
    .post(baseUrl)
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  return { ticket, order, user };
}

describe("get order by ID", () => {
  it("returns 404 if order does not exist", async () => {
    const orderId = new mongoose.Types.ObjectId();
    await request(app)
      .get(`${baseUrl}/${orderId}`)
      .set("Cookie", global.signin())
      .send()
      .expect(404);
  });

  it("returns 401 if order does not belong to current user", async () => {
    const { order, user } = await createTicketAndOrder();
    await request(app)
      .get(`${baseUrl}/${order.id}`)
      .set("Cookie", global.signin())
      .send()
      .expect(401);
  });

  it("returns the order by id for authorized user", async () => {
    const { order, user } = await createTicketAndOrder();

    const { body: fetchedOrder } = await request(app)
      .get(`${baseUrl}/${order.id}`)
      .set("Cookie", user)
      .send()
      .expect(200);

    expect(fetchedOrder.id).toEqual(order.id);
  });
});
