import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

describe("/api/tickets - PUT update ticket", () => {
  it("returns 404 if ticket with provided id doesnt exist", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
      .put(`/api/tickets/${id}`)
      .set("Cookie", global.signin())
      .send({ title: "foo", price: 12 })
      .expect(404);
  });

  it("returns 401 if user is not authenticated", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app).put(`/api/tickets/${id}`).send({}).expect(401);
  });

  it("returns 401 if user does not own the ticket", async () => {
    const response = await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({ title: "foo", price: 12 });

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set("Cookie", global.signin()) // we generate the cookie again, simulating different user
      .send({ title: "fooNew", price: 15 })
      .expect(401);
  });

  it("returns 400 if user provides invalid title or price", async () => {
    const cookie = global.signin();
    const response = await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({ title: "foo", price: 12 });

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set("Cookie", cookie)
      .send({ title: "fooNew", price: -15 })
      .expect(400);

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set("Cookie", cookie)
      .send({ title: "", price: 15 })
      .expect(400);
  });

  it("updates the ticket provided valid title and price", async () => {
    const cookie = global.signin();
    const response = await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({ title: "foo", price: 12 });

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set("Cookie", cookie)
      .send({ title: "fooNew", price: 15 })
      .expect(200);

    const fetchedTicket = await request(app)
      .get(`/api/tickets/${response.body.id}`)
      .send();

    expect(fetchedTicket.body.title).toEqual("fooNew");
    expect(fetchedTicket.body.price).toEqual(15);
  });
});
