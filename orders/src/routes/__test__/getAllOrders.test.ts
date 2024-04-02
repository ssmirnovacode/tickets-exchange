import request from "supertest";
import { baseUrl } from "../../constants";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();
  return ticket;
};

describe("get all current user's orders", () => {
  it("returns error if not authenticated", async () => {
    await request(app).get(baseUrl).send().expect(401);
  });
  it("returns all orders", async () => {
    const ticket1 = await buildTicket();
    const ticket2 = await buildTicket();
    const ticket3 = await buildTicket();

    const user1 = global.signin();
    const user2 = global.signin();

    await request(app)
      .post(baseUrl)
      .set("Cookie", user1)
      .send({ ticketId: ticket1.id })
      .expect(201);

    await request(app)
      .post(baseUrl)
      .set("Cookie", user2)
      .send({ ticketId: ticket2.id })
      .expect(201);

    await request(app)
      .post(baseUrl)
      .set("Cookie", user2)
      .send({ ticketId: ticket3.id })
      .expect(201);

    const response1 = await request(app)
      .get(baseUrl)
      .set("Cookie", user1)
      .send()
      .expect(200);
    const response2 = await request(app)
      .get(baseUrl)
      .set("Cookie", user2)
      .send()
      .expect(200);

    expect(response1.body.length).toEqual(1);
    expect(response2.body.length).toEqual(2);
  });
});
