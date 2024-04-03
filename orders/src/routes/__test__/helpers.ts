import request from "supertest";
import { Ticket } from "../../models/ticket";
import { app } from "../../app";
import { baseUrl } from "../../constants";

export async function createTicketAndOrder() {
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
